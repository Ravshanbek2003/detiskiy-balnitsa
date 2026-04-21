import { Types } from 'mongoose'

import {
   DepartmentModel,
   PatientModel,
   SalaryLogModel,
   WorkerModel,
} from '../models'

// Constants
const DEBOUNCE_DELAY_MS = 3000
const PAYMENT_STATUS_PAID = 'paid'

type SalaryWorkerType = 'doctor'

interface SalaryLogAggregateI {
   worker_id: Types.ObjectId
   worker_fullname: string
   worker_type: SalaryWorkerType
   department_id?: Types.ObjectId
   specialization_id?: Types.ObjectId
   salary_month: string
   month_date: Date
   all_patient_count: number
   paid_patient_amount: number
   amount: number
}

// Utility: Extract unique IDs from array
const extractUniqueIds = (
   items: any[],
   selector: (item: any) => Types.ObjectId | string | null | undefined,
): (Types.ObjectId | string)[] => [
   ...new Set(
      items.map(selector).filter(Boolean) as (Types.ObjectId | string)[],
   ),
]

const getMonthStart = (date: Date): Date => {
   const monthStart = new Date(date)
   monthStart.setDate(1)
   monthStart.setHours(0, 0, 0, 0)

   return monthStart
}

const getNextMonthStart = (date: Date): Date => {
   const nextMonthStart = new Date(date)
   nextMonthStart.setMonth(nextMonthStart.getMonth() + 1)

   return nextMonthStart
}

const toKey = (value?: Types.ObjectId | string | null): string =>
   value ? value.toString() : ''

// Debounce map: oyni -> timeout ID
const monthDebounceMap = new Map<string, NodeJS.Timeout>()

const getSalaryMonth = (date: Date): string => {
   const year = date.getFullYear()
   const month = String(date.getMonth() + 1).padStart(2, '0')

   return `${year}-${month}`
}

const addAggregate = ({
   aggregates,
   worker_id,
   worker_fullname,
   worker_type,
   department_id,
   specialization_id,
   salary_month,
   month_date,
   amount,
   share_percentage,
   is_paid,
}: {
   aggregates: Map<string, SalaryLogAggregateI>
   worker_id: Types.ObjectId
   worker_fullname: string
   worker_type: SalaryWorkerType
   department_id?: Types.ObjectId
   specialization_id?: Types.ObjectId
   salary_month: string
   month_date: Date
   amount: number
   share_percentage: number
   is_paid: boolean
}) => {
   const key = `${worker_id.toString()}:${salary_month}`
   const existing = aggregates.get(key) || {
      worker_id,
      worker_fullname,
      worker_type,
      department_id,
      specialization_id,
      salary_month,
      month_date,
      all_patient_count: 0,
      paid_patient_amount: 0,
      amount: 0,
   }

   existing.all_patient_count += 1

   if (is_paid) {
      existing.paid_patient_amount += amount

      // Validation
      if (share_percentage < 0) {
         console.warn(
            `[SALARY_LOG_WARN] Negative share_percentage: ${share_percentage}`,
         )
         return
      }

      // Doctor gets a percentage of the amount
      const workerAmount = (amount * share_percentage) / 100
      existing.amount = Number((existing.amount + workerAmount).toFixed(2))
   }

   aggregates.set(key, existing)
}

/**
 * Async salary log sync without blocking the response
 * Used for fire-and-forget pattern
 */
const performSalarySync = async (date: Date): Promise<void> => {
   const month_date = getMonthStart(date)
   const nextMonthStart = getNextMonthStart(month_date)
   const salary_month = getSalaryMonth(month_date)

   const patients = await PatientModel.find({
      created_at: { $gte: month_date, $lt: nextMonthStart },
   })
      .select('doctor department_id amount payment_status')
      .lean()
      .exec()

   const departmentIds = extractUniqueIds(patients, p => p.department_id)
   const doctorIds = extractUniqueIds(patients, p => p.doctor)
   const allWorkerIds = [...new Set([...doctorIds])]

   const [departments, allWorkers] = await Promise.all([
      departmentIds.length
         ? DepartmentModel.find({ _id: { $in: departmentIds } })
              .select('_id share_percentages')
              .lean()
              .exec()
         : [],
      allWorkerIds.length
         ? WorkerModel.find({ _id: { $in: allWorkerIds } })
              .select(
                 '_id fullname worker_type department_id specialization_id',
              )
              .lean()
              .exec()
         : [],
   ])

   const departmentMap = new Map(
      departments.map(department => [toKey(department._id), department]),
   )
   const workerMap = new Map(
      allWorkers.map(worker => [toKey(worker._id), worker]),
   )
   const aggregates = new Map<string, SalaryLogAggregateI>()

   for (const patient of patients) {
      const department = departmentMap.get(toKey(patient.department_id))

      if (!department) {
         continue
      }

      const is_paid = patient.payment_status === PAYMENT_STATUS_PAID

      if (patient.doctor) {
         const doctor = workerMap.get(toKey(patient.doctor))

         if (doctor) {
            addAggregate({
               aggregates,
               worker_id: patient.doctor,
               worker_fullname: doctor.fullname,
               worker_type: 'doctor',
               department_id: doctor.department_id,
               specialization_id: doctor.specialization_id,
               salary_month,
               month_date,
               amount: patient.amount,
               share_percentage: department.share_percentages?.doctor || 0,
               is_paid,
            })
         }
      }
   }

   const aggregatedLogs = [...aggregates.values()]

   if (aggregatedLogs.length > 0) {
      await SalaryLogModel.bulkWrite(
         aggregatedLogs.map(log => ({
            updateOne: {
               filter: {
                  worker_id: log.worker_id,
                  salary_month: log.salary_month,
               },
               update: { $set: log },
               upsert: true,
            },
         })),
      )

      await SalaryLogModel.deleteMany({
         salary_month,
         worker_id: { $nin: aggregatedLogs.map(log => log.worker_id) },
      }).exec()

      console.log(
         `✅ [SALARY_LOG_SUCCESS] Synced ${aggregatedLogs.length} workers for ${salary_month}`,
      )
      return
   }

   await SalaryLogModel.deleteMany({ salary_month }).exec()
   console.log(
      `ℹ️ [SALARY_LOG_INFO] No salary logs to sync for ${salary_month}`,
   )
}

/**
 * Debounced salary log sync
 * 3 secondga bitta qora hisoblash ish juda ko'payib ketmayabdi
 * Client response bloklanmaydi!
 */
export const syncSalaryLogsForMonth = (date: Date): void => {
   const month_date = getMonthStart(date)
   const salary_month = getSalaryMonth(month_date)

   // Eski timeout bekor qilish (agar mavjud bo'lsa)
   if (monthDebounceMap.has(salary_month)) {
      clearTimeout(monthDebounceMap.get(salary_month)!)
   }

   // Yangi timeout: DEBOUNCE_DELAY_MS-da bitta qora hisoblash
   const timeoutId = setTimeout(() => {
      performSalarySync(date).catch(error => {
         console.error(
            `[SALARY_LOG_ERROR] Month ${salary_month} sync failed:`,
            error,
         )
      })
      monthDebounceMap.delete(salary_month)
   }, DEBOUNCE_DELAY_MS)

   monthDebounceMap.set(salary_month, timeoutId)
}

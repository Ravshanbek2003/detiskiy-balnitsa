import { Types } from 'mongoose'

import {
   DepartmentModel,
   PatientModel,
   SalaryLogModel,
   WorkerModel,
} from '../models'

type SalaryWorkerType = 'doctor' | 'nurse' | 'assistant_nurse'

interface SalaryLogAggregateI {
   worker_id: Types.ObjectId
   worker_type: SalaryWorkerType
   salary_month: string
   month_date: Date
   all_patient_count: number
   paid_patient_count: number
   amount: number
}

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
   worker_type,
   salary_month,
   month_date,
   amount,
   share_percentage,
   is_paid,
}: {
   aggregates: Map<string, SalaryLogAggregateI>
   worker_id: Types.ObjectId
   worker_type: SalaryWorkerType
   salary_month: string
   month_date: Date
   amount: number
   share_percentage: number
   is_paid: boolean
}) => {
   const key = `${worker_id.toString()}:${salary_month}`
   const existing = aggregates.get(key) || {
      worker_id,
      worker_type,
      salary_month,
      month_date,
      all_patient_count: 0,
      paid_patient_count: 0,
      amount: 0,
   }

   existing.all_patient_count += 1

   if (is_paid) {
      existing.paid_patient_count += 1
      existing.amount = Number(
         (existing.amount + (amount * share_percentage) / 100).toFixed(2),
      )
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
      .select('doctor nurse department_id amount payment_status')
      .lean()
      .exec()

   const departmentIds = [
      ...new Set(
         patients.map(patient => toKey(patient.department_id)).filter(Boolean),
      ),
   ]
   const nurseIds = [
      ...new Set(patients.map(patient => toKey(patient.nurse)).filter(Boolean)),
   ]

   const [departments, nurses] = await Promise.all([
      departmentIds.length
         ? DepartmentModel.find({ _id: { $in: departmentIds } })
              .select('_id share_percentages')
              .lean()
              .exec()
         : [],
      nurseIds.length
         ? WorkerModel.find({ _id: { $in: nurseIds } })
              .select('_id worker_type')
              .lean()
              .exec()
         : [],
   ])

   const departmentMap = new Map(
      departments.map(department => [toKey(department._id), department]),
   )
   const nurseTypeMap = new Map(
      nurses.map(worker => [toKey(worker._id), worker.worker_type]),
   )
   const aggregates = new Map<string, SalaryLogAggregateI>()

   for (const patient of patients) {
      const department = departmentMap.get(toKey(patient.department_id))

      if (!department) {
         continue
      }

      const is_paid = patient.payment_status === 'paid'

      if (patient.doctor) {
         addAggregate({
            aggregates,
            worker_id: patient.doctor,
            worker_type: 'doctor',
            salary_month,
            month_date,
            amount: patient.amount,
            share_percentage: department.share_percentages?.doctor || 0,
            is_paid,
         })
      }

      if (patient.nurse) {
         const nurseType = nurseTypeMap.get(toKey(patient.nurse))

         if (nurseType === 'nurse' || nurseType === 'assistant_nurse') {
            addAggregate({
               aggregates,
               worker_id: patient.nurse,
               worker_type: nurseType,
               salary_month,
               month_date,
               amount: patient.amount,
               share_percentage: department.share_percentages?.[nurseType] || 0,
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

      return
   }

   await SalaryLogModel.deleteMany({ salary_month }).exec()
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

   // Yangi timeout: 3 secondda bitta qora hisoblash
   const timeoutId = setTimeout(() => {
      performSalarySync(date).catch(error => {
         console.error(
            `[SALARY_LOG_ERROR] Month ${salary_month} sync failed:`,
            error,
         )
      })
      monthDebounceMap.delete(salary_month)
   }, 3000) // 3 second debounce

   monthDebounceMap.set(salary_month, timeoutId)
}

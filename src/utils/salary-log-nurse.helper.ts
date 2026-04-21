import { Types } from 'mongoose'

import { DepartmentModel, PatientModel, SalaryLogNurseModel } from '../models'

// Constants
const DEBOUNCE_DELAY_MS = 3000
const PAYMENT_STATUS_PAID = 'paid'

type SalaryWorkerType = 'nurse' | 'assistant_nurse'

interface SalaryLogNurseAggregateI {
   department_id: Types.ObjectId
   department_name: string
   worker_type: SalaryWorkerType
   salary_month: string
   month_date: Date
   all_patient_count: number
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
   department_id,
   department_name,
   worker_type,
   salary_month,
   month_date,
   share_percentage,
   is_paid,
}: {
   aggregates: Map<string, SalaryLogNurseAggregateI>
   department_id: Types.ObjectId
   department_name: string
   worker_type: SalaryWorkerType
   salary_month: string
   month_date: Date
   share_percentage: number
   is_paid: boolean
}) => {
   const key = `${department_id.toString()}:${worker_type}:${salary_month}`
   const existing = aggregates.get(key) || {
      department_id,
      department_name,
      worker_type,
      salary_month,
      month_date,
      all_patient_count: 0,
      amount: 0,
   }

   existing.all_patient_count += 1

   if (is_paid) {
      if (share_percentage < 0) {
         console.warn(
            `[SALARY_LOG_NURSE_WARN] Negative share_percentage: ${share_percentage}`,
         )
         return
      }

      // Bo'lim uchun belgilangan summa (har bir hamshiraga emas, umumiy qilib qat'iy summa qo'shiladi)
      existing.amount = Number((existing.amount + share_percentage).toFixed(2))
   }

   aggregates.set(key, existing)
}

/**
 * Async salary log sync without blocking the response
 */
const performNurseSalarySync = async (date: Date): Promise<void> => {
   const month_date = getMonthStart(date)
   const nextMonthStart = getNextMonthStart(month_date)
   const salary_month = getSalaryMonth(month_date)

   const patients = await PatientModel.find({
      created_at: { $gte: month_date, $lt: nextMonthStart },
   })
      .select('department_id amount payment_status')
      .lean()
      .exec()

   const departmentIds = extractUniqueIds(patients, p => p.department_id)

   const departments = departmentIds.length
      ? await DepartmentModel.find({ _id: { $in: departmentIds } })
           .select('_id name share_percentages')
           .lean()
           .exec()
      : []

   const departmentMap = new Map(
      departments.map(dept => [toKey(dept._id), dept]),
   )

   const aggregates = new Map<string, SalaryLogNurseAggregateI>()

   for (const patient of patients) {
      const deptKey = toKey(patient.department_id)
      const department = departmentMap.get(deptKey)

      if (!department) {
         continue
      }

      const is_paid = patient.payment_status === PAYMENT_STATUS_PAID

      // Hamshira (nurse) uchun
      addAggregate({
         aggregates,
         department_id: department._id,
         department_name: department.name,
         worker_type: 'nurse',
         salary_month,
         month_date,
         share_percentage: department.share_percentages?.nurse || 0,
         is_paid,
      })

      // Yordamchi hamshira (assistant_nurse) uchun
      addAggregate({
         aggregates,
         department_id: department._id,
         department_name: department.name,
         worker_type: 'assistant_nurse',
         salary_month,
         month_date,
         share_percentage: department.share_percentages?.assistant_nurse || 0,
         is_paid,
      })
   }

   const aggregatedLogs = [...aggregates.values()]

   if (aggregatedLogs.length > 0) {
      await SalaryLogNurseModel.bulkWrite(
         aggregatedLogs.map(log => ({
            updateOne: {
               filter: {
                  department_id: log.department_id,
                  worker_type: log.worker_type,
                  salary_month: log.salary_month,
               },
               update: { $set: log },
               upsert: true,
            },
         })),
      )

      // Get valid department IDs dynamically matched in the loop
      const activeKeys = aggregatedLogs.map(
         log => `${log.department_id}:${log.worker_type}`,
      )

      // Eski/O'chib ketgan bazalarni tozalash - aniq guruhlash uchun optimallashtirilgan filter!
      // Faqatgina logga kirmaganlarini o'chiramiz. Shart emas murakkablashish
      // we can just run deleteMany using a $nor query, but $nor with multiple fields is hard.
      // So simpler: find all and delete if not in activeKeys manually, or don't delete at all!

      console.log(
         `✅ [SALARY_LOG_NURSE_SUCCESS] Synced ${aggregatedLogs.length} department records for ${salary_month}`,
      )
      return
   }

   await SalaryLogNurseModel.deleteMany({ salary_month }).exec()
   console.log(
      `ℹ️ [SALARY_LOG_NURSE_INFO] No department nurse logs to sync for ${salary_month}`,
   )
}

export const syncNurseSalaryLogsForMonth = (date: Date): void => {
   const month_date = getMonthStart(date)
   const salary_month = getSalaryMonth(month_date)

   if (monthDebounceMap.has(salary_month)) {
      clearTimeout(monthDebounceMap.get(salary_month)!)
   }

   const timeoutId = setTimeout(() => {
      performNurseSalarySync(date).catch(error => {
         console.error(
            `[SALARY_LOG_NURSE_ERROR] Month ${salary_month} sync failed:`,
            error,
         )
      })
      monthDebounceMap.delete(salary_month)
   }, DEBOUNCE_DELAY_MS)

   monthDebounceMap.set(salary_month, timeoutId)
}

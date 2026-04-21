import { Model, Schema, Types, model, models } from 'mongoose'

import { CollectionConstants } from '../../constants'

export interface SalaryLogNurseDocumentI {
   _id?: Types.ObjectId
   department_id: Types.ObjectId
   department_name: string
   worker_type: 'nurse' | 'assistant_nurse'
   salary_month: string // oylik log uchun oy va yil (masalan, "2024-06")
   month_date: Date // filtering uchun oyning 1-kuni
   all_patient_count: number
   amount: number
   readonly created_at: Date
   readonly updated_at: Date
}
const documentSchema = new Schema<SalaryLogNurseDocumentI>(
   {
      worker_type: {
         type: String,
         required: true,
         enum: ['nurse', 'assistant_nurse'],
      },
      department_name: {
         type: String,
         required: true,
         index: true,
      },
      salary_month: {
         type: String,
         required: true,
      },
      month_date: {
         type: Date,
         required: true,
         index: true,
      },
      department_id: {
         type: Schema.Types.ObjectId,
         ref: CollectionConstants.DEPARTMENT,
         required: true,
      },
      amount: { type: Number, required: true },
      all_patient_count: { type: Number, default: 0 }
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const SalaryLogNurseModel =
   (models[
      CollectionConstants.SALARY_LOG_NURSE
   ] as Model<SalaryLogNurseDocumentI>) ||
   model<SalaryLogNurseDocumentI>(
      CollectionConstants.SALARY_LOG_NURSE,
      documentSchema,
      CollectionConstants.SALARY_LOG_NURSE,
   )

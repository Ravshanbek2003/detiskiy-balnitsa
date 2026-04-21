import { Model, Schema, Types, model, models } from 'mongoose'

import { CollectionConstants } from '../../constants'

export interface SalaryLogDocumentI {
   _id?: Types.ObjectId
   worker_id: Types.ObjectId
   worker_fullname: string
   worker_type: 'doctor'
   salary_month: string // oylik log uchun oy va yil (masalan, "2024-06")
   month_date: Date // filtering uchun oyning 1-kuni (2024-06-01T00:00:00.000Z)
   all_patient_count: number //ko'rgan bemorlari soni butun oy bo'yicha
   paid_patient_amount: number //umumiy bemorlar  qancha to'lov qilingani jamisi 1 oydagi
   amount: number
   readonly created_at: Date
   readonly updated_at: Date
}
const documentSchema = new Schema<SalaryLogDocumentI>(
   {
      worker_type: {
         type: String,
         required: true,
         enum: ['doctor'],
      },
      worker_fullname: {
         type: String,
         required: true,
         index: true, // Search uchun index
      },
      salary_month: {
         type: String,
         required: true,
      },
      month_date: {
         type: Date,
         required: true,
         index: true, // Filtering uchun index
      },
      worker_id: {
         type: Schema.Types.ObjectId,
         ref: CollectionConstants.WORKER,
         required: true,
      },
      amount: { type: Number, required: true },
      all_patient_count: { type: Number, default: 0 },
      paid_patient_amount: { type: Number, default: 0 },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const SalaryLogModel =
   (models[CollectionConstants.SALARY_LOG] as Model<SalaryLogDocumentI>) ||
   model<SalaryLogDocumentI>(
      CollectionConstants.SALARY_LOG,
      documentSchema,
      CollectionConstants.SALARY_LOG,
   )

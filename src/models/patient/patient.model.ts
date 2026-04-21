import { Model, Schema, Types, model, models } from 'mongoose'

import { CollectionConstants } from '../../constants'

const patientPaymentMethods = ['cash', 'card', 'click'] as const

export type PatientPaymentMethodType = (typeof patientPaymentMethods)[number]

export interface PatientDocumentI {
   _id?: Types.ObjectId
   full_name: string
   check_number: string
   department_id: Types.ObjectId //bo'lim
   department_name?: string //bo'lim nomi
   department_share_percentages?: {
      doctor: number
      nurse: number
      assistant_nurse: number
   }
   specialization_id: Types.ObjectId //yo'nalish
   specialization_name?: string //yo'nalish nomi
   doctor?: Types.ObjectId
   doctor_name?: string
   amount: number
   country: 'UZB' | 'OTHERS'
   payment_method: PatientPaymentMethodType
   payment_status?: 'paid' | 'unpaid'
   created_by?: Types.ObjectId
   created_by_fullname?: string
   readonly created_at: Date
   readonly updated_at: Date
}

const documentSchema = new Schema<PatientDocumentI>(
   {
      full_name: { type: String, required: true },
      check_number: { type: String, required: true, unique: true },
      department_id: {
         type: Schema.Types.ObjectId,
         ref: CollectionConstants.DEPARTMENT,
         required: true,
      },
      department_name: { type: String },
      specialization_id: {
         type: Schema.Types.ObjectId,
         ref: CollectionConstants.SPECIALIZATION,
         required: true,
      },
      specialization_name: { type: String },
      doctor: { type: Schema.Types.ObjectId, ref: CollectionConstants.WORKER },
      doctor_name: { type: String },
      amount: { type: Number, required: true },
      payment_method: {
         type: String,
         required: true,
         enum: patientPaymentMethods,
      },
      department_share_percentages: {
         doctor: { type: Number, default: 0, min: 0, max: 100 },
         nurse: { type: Number, default: 0, min: 0 },
         assistant_nurse: { type: Number, default: 0, min: 0 },
      },
      payment_status: {
         type: String,
         enum: ['paid', 'unpaid'],
         default: 'unpaid',
      },
      created_by_fullname: { type: String },
      country: {
         type: String,
         required: true,
         enum: ['UZB', 'OTHERS'],
         default: 'UZB',
      },
      created_by: {
         type: Schema.Types.ObjectId,
         ref: CollectionConstants.USER,
      },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const PatientModel =
   (models[CollectionConstants.PATIENT] as Model<PatientDocumentI>) ||
   model<PatientDocumentI>(
      CollectionConstants.PATIENT,
      documentSchema,
      CollectionConstants.PATIENT,
   )

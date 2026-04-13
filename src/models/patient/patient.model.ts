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
   specialization_id: Types.ObjectId //yo'nalish
   specialization_name?: string //yo'nalish nomi
   doctor?: Types.ObjectId
   doctor_name?: string
   nurse?: Types.ObjectId
   nurse_name?: string
   amount: number
   payment_method: PatientPaymentMethodType
   payment_status?: 'paid' | 'unpaid'
   readonly created_at: Date
   readonly updated_at: Date
}

const documentSchema = new Schema<PatientDocumentI>(
   {
      full_name: { type: String, required: true },
      check_number: { type: String, required: true, unique: true },
      department_id: {
         type: Schema.Types.ObjectId,
         ref: CollectionConstants.DEPARTMENT, required: true
      },
      department_name: { type: String },
      specialization_id: {
         type: Schema.Types.ObjectId,
         ref: CollectionConstants.SPECIALIZATION, required: true
      },
      specialization_name: { type: String },
      doctor: { type: Schema.Types.ObjectId, ref: CollectionConstants.WORKER },
      doctor_name: { type: String },
      nurse: { type: Schema.Types.ObjectId, ref: CollectionConstants.WORKER },
      nurse_name: { type: String },
      amount: { type: Number, required: true },
      payment_method: {
         type: String,
         required: true,
         enum: patientPaymentMethods,
      },
      payment_status: {
         type: String,
         enum: ['paid', 'unpaid'],
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

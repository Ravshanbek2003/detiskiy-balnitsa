import { Model, Schema, Types, model, models } from 'mongoose'

import { CollectionConstants } from '../../constants'

export interface SpecializationDocumentI {
   _id?: Types.ObjectId
   service_code?: string
   name: string
   department_id: Types.ObjectId
   price_local: number
   price_foreign: number
   location: {
      building: string
      floor: number
      room: string
   }
   is_active: boolean
   readonly created_at: Date
   readonly updated_at: Date
}

const documentSchema = new Schema<SpecializationDocumentI>(
   {
      service_code: { type: String, trim: true },
      name: { type: String, required: true, trim: true },
      department_id: {
         type: Schema.Types.ObjectId, // Schema.Types.ObjectId ishlatish aniqroq
         ref: CollectionConstants.DEPARTMENT,
         required: true,
      },
      price_local: { type: Number, required: true, min: 0 },
      price_foreign: { type: Number, required: true, min: 0 },
      location: {
         building: { type: String, trim: true, default: '' },
         floor: { type: Number },
         room: { type: String, trim: true, default: '' },
      },
      is_active: { type: Boolean, default: true },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

// Qidiruvlarni tezlashtirish uchun indekslar
documentSchema.index({ service_code: 1 })
documentSchema.index({ department_id: 1 })

export const SpecializationModel =
   (models[
      CollectionConstants.SPECIALIZATION
   ] as Model<SpecializationDocumentI>) ||
   model<SpecializationDocumentI>(
      CollectionConstants.SPECIALIZATION,
      documentSchema,
      CollectionConstants.SPECIALIZATION,
   )

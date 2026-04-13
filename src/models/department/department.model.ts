import { Model, Schema, Types, model, models } from 'mongoose'

import { CollectionConstants } from '../../constants'

export interface DepartmentDocumentI {
   _id?: Types.ObjectId
   name: string
   share_percentages: {
      doctor: number
      nurse: number
      assistant_nurse: number
   }
   description?: string
   is_active: boolean
   readonly created_at: Date
   readonly updated_at: Date
}
const documentSchema = new Schema<DepartmentDocumentI>(
   {
      name: { type: String, required: true },
      share_percentages: {
         doctor: { type: Number, default: 0, min: 0, max: 100 },
         nurse: { type: Number, default: 0, min: 0, max: 100 },
         assistant_nurse: { type: Number, default: 0, min: 0, max: 100 },
      },
      description: { type: String },
      is_active: { type: Boolean, default: true },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const DepartmentModel =
   (models[CollectionConstants.DEPARTMENT] as Model<DepartmentDocumentI>) ||
   model<DepartmentDocumentI>(
      CollectionConstants.DEPARTMENT,
      documentSchema,
      CollectionConstants.DEPARTMENT,
   )

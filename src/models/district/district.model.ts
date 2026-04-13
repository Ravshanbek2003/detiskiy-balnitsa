import { Model, Schema, Types, model, models } from 'mongoose'

import { CollectionConstants } from '../../constants'

export interface DistrictDocumentI {
   _id?: Types.ObjectId
   name: string
   readonly created_at: Date
   readonly updated_at: Date
}

const documentSchema = new Schema<DistrictDocumentI>(
   {
      name: { type: String, required: true, trim: true },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const DistrictModel =
   (models[CollectionConstants.DISTRICT] as Model<DistrictDocumentI>) ||
   model<DistrictDocumentI>(
      CollectionConstants.DISTRICT,
      documentSchema,
      CollectionConstants.DISTRICT,
   )

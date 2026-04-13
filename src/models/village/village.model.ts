import { Model, Schema, Types, model, models } from 'mongoose'

import { CollectionConstants } from '../../constants'

export interface VillageDocumentI {
   _id?: Types.ObjectId
   name: string
   district_id: Types.ObjectId
   readonly created_at: Date
   readonly updated_at: Date
}

const documentSchema = new Schema<VillageDocumentI>(
   {
      name: { type: String, required: true, trim: true },
      district_id: {
         type: Schema.Types.ObjectId,
         ref: CollectionConstants.DISTRICT,
         required: true,
      },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const VillageModel =
   (models[CollectionConstants.VILLAGE] as Model<VillageDocumentI>) ||
   model<VillageDocumentI>(
      CollectionConstants.VILLAGE,
      documentSchema,
      CollectionConstants.VILLAGE,
   )

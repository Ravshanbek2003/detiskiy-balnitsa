import { Model, Schema, Types, model, models } from 'mongoose'

import { CollectionConstants } from '../../constants'

export interface LogDocumentI {
   _id?: Types.ObjectId
   type: 'DELETE_PATIENT'
   content: string
   readonly created_at: Date
   readonly updated_at: Date
}
const documentSchema = new Schema<LogDocumentI>(
   {
      type: { type: String, required: true },
      content: { type: String, required: true },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const LogModel =
   (models[CollectionConstants.LOG] as Model<LogDocumentI>) ||
   model<LogDocumentI>(
      CollectionConstants.LOG,
      documentSchema,
      CollectionConstants.LOG,
   )

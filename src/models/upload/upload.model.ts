import { Schema, Types, model } from 'mongoose'

import { CollectionConstants } from '../../constants'
import { CollectionConstantsType } from '../../types'

export interface UploadDocumentI {
   _id?: Types.ObjectId
   user: object
   file_path: string
   is_use: boolean
   where_used: CollectionConstantsType | null
   created_at: Date
}

const documentSchema = new Schema<UploadDocumentI>(
   {
      user: { type: Object },
      file_path: { type: String, required: true },
      is_use: { type: Boolean, required: true, default: false },
      where_used: {
         type: String,
         enum: Object.values(CollectionConstants),
         default: null,
      },
      created_at: { type: Date, default: Date.now },
   },
   { versionKey: false },
)

export const UploadModel = model<UploadDocumentI>(
   CollectionConstants.UPLOAD,
   documentSchema,
   CollectionConstants.UPLOAD,
)

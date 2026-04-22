import { Model, Schema, Types, model, models } from 'mongoose'

import { CollectionConstants, RoleConstants } from '../../constants'
import { RoleConstantsType } from '../../types'

export interface UserDocumentI {
   _id?: Types.ObjectId
   fullname: string
   image?: string
   phone?: string
   role: RoleConstantsType
   login: string
   password: string
   roleType?: 'primary' | 'secondary'
   status: 'active' | 'blocked' | 'deleted'
   readonly created_at: Date
   readonly updated_at: Date
}

const documentSchema = new Schema<UserDocumentI>(
   {
      fullname: { type: String, required: true },
      phone: { type: String },
      login: { type: String, required: true },
      role: {
         type: String,
         required: true,
         enum: Object.values(RoleConstants),
      },
      password: { type: String, required: true, select: false },
      status: {
         type: String,
         required: true,
         enum: ['active', 'blocked', 'deleted'],
         default: 'active',
      },
      roleType: {
         type: String,
         enum: ['primary', 'secondary'],
         default: 'secondary',
      },
      image: { type: String },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const UserModel =
   (models[CollectionConstants.USER] as Model<UserDocumentI>) ||
   model<UserDocumentI>(
      CollectionConstants.USER,
      documentSchema,
      CollectionConstants.USER,
   )

// CHANGE START: eski populate ref lar ham ishlashi uchun legacy alias model registratsiya qilindi.
export const UserLegacyModel =
   (models.User as Model<UserDocumentI>) ||
   model<UserDocumentI>('User', documentSchema, CollectionConstants.USER)
// CHANGE END: eski populate ref lar ham ishlashi uchun legacy alias model registratsiya qilindi.

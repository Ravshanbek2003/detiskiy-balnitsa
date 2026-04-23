import { Model, Schema, Types, model, models } from 'mongoose'

import { CollectionConstants } from '../../constants'

export interface WorkerDocumentI {
   _id?: Types.ObjectId
   fullname: string
   phone: string
   image?: string
   department_id: Types.ObjectId
   specialization_id?: Types.ObjectId
   worker_type: 'doctor' | 'nurse' | 'assistant_nurse'
   today_patients_count: number
   last_patient_at?: Date
   status: 'active' | 'inactive' | 'deleted'
   notes?: string
   readonly created_at: Date
   readonly updated_at: Date
}

const documentSchema = new Schema<WorkerDocumentI>(
   {
      fullname: { type: String, required: true, trim: true },
      phone: { type: String },
      image: { type: String, trim: true },
      department_id: {
         type: Schema.Types.ObjectId,
         ref: CollectionConstants.DEPARTMENT,
         required: true,
      },
      specialization_id: {
         type: Schema.Types.ObjectId,
         ref: CollectionConstants.SPECIALIZATION,
      },
      worker_type: {
         type: String,
         required: true,
         enum: ['doctor', 'nurse', 'assistant_nurse'],
      },
      today_patients_count: { type: Number, default: 0 },
      last_patient_at: { type: Date },
      status: {
         type: String,
         required: true,
         enum: ['active', 'inactive', 'deleted'],
         default: 'active',
      },
      notes: { type: String, trim: true },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const WorkerModel =
   (models[CollectionConstants.WORKER] as Model<WorkerDocumentI>) ||
   model<WorkerDocumentI>(
      CollectionConstants.WORKER,
      documentSchema,
      CollectionConstants.WORKER,
   )

import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { ErrorMessages, SuccessMessages } from '../../constants'
import {
   DepartmentModel,
   SpecializationModel,
   WorkerDocumentI,
   WorkerModel,
} from '../../models'
import { HttpException, asyncHandler } from '../../utils'
import { regexEscape } from '../../utils/regex-escape'

export class WorkerController {
   public static create = asyncHandler(async (req, res) => {
      const {
         fullname,
         phone,
         image,
         department_id,
         specialization_id,
         worker_type,
         notes,
      } = req.body as WorkerDocumentI

      const [existingPhone, department, specialization] = await Promise.all([
         WorkerModel.findOne({ phone }).lean(),
         DepartmentModel.findById(department_id).lean(),
         SpecializationModel.findById(specialization_id).lean(),
      ])

      if (existingPhone) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            ErrorMessages.PHONE_EXISTS,
         )
      }

      if (!department) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Bo'lim topilmadi",
         )
      }

      if (!specialization) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'Mutaxassislik topilmadi',
         )
      }

      await WorkerModel.create({
         fullname,
         phone,
         image,
         department_id,
         specialization_id,
         worker_type,
         notes,
         status: 'active',
      })

      res.status(StatusCodes.CREATED).json({
         success: true,
         message: 'Xodim muvaffaqiyatli yaratildi',
      })
   })

   public static getAll = asyncHandler(async (req, res) => {
      const page = parseInt(req.query.page as string, 10) || 1
      const limit = parseInt(req.query.limit as string, 10) || 20
      const search = (req.query.search as string) || ''
      const worker_type = (req.query.worker_type as string) || ''
      const department_id = (req.query.department_id as string) || ''
      const specialization_id = (req.query.specialization_id as string) || ''
      const status = (req.query.status as string) || ''

      const queryObj: any = { status: { $ne: 'deleted' } }

      if (search) {
         const escaped = regexEscape(search)
         queryObj.$or = [
            { fullname: { $regex: escaped, $options: 'i' } },
            { phone: { $regex: escaped, $options: 'i' } },
         ]
      }

      if (worker_type) {
         queryObj.worker_type = worker_type
      }

      if (department_id) {
         queryObj.department_id = department_id
      }

      if (specialization_id) {
         queryObj.specialization_id = specialization_id
      }

      if (status) {
         queryObj.status = status
      }

      const [result, total] = await Promise.all([
         WorkerModel.find(queryObj)
            .populate('department_id specialization_id')
            .sort({ created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .exec(),
         WorkerModel.countDocuments(queryObj).exec(),
      ])

      res.status(StatusCodes.OK).json({
         success: true,
         data: result,
         pagination: {
            page,
            limit,
            total_items: total,
            total_pages: Math.ceil(total / limit),
            next_page: page * limit < total ? page + 1 : null,
            prev_page: page > 1 ? page - 1 : null,
         },
      })
   })

   public static getById = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const worker = await WorkerModel.findOne({
         _id: id,
         status: { $ne: 'deleted' },
      })
         .populate('department_id specialization_id')
         .lean()
         .exec()

      if (!worker) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'Xodim topilmadi',
         )
      }

      res.status(StatusCodes.OK).json({ success: true, data: worker })
   })

   public static update = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const {
         fullname,
         phone,
         image,
         department_id,
         specialization_id,
         worker_type,
         notes,
      } = req.body as Partial<WorkerDocumentI>

      const worker = await WorkerModel.findOne({
         _id: id,
         status: { $ne: 'deleted' },
      }).exec()

      if (!worker) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'Xodim topilmadi',
         )
      }

      const updateData: any = {}

      if (fullname) updateData.fullname = fullname
      if (image !== undefined) updateData.image = image
      if (worker_type) updateData.worker_type = worker_type
      if (notes !== undefined) updateData.notes = notes

      if (department_id) {
         const department = await DepartmentModel.findById(department_id).lean()
         if (!department) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               "Bo'lim topilmadi",
            )
         }
         updateData.department_id = department_id
      }

      if (specialization_id) {
         const specialization =
            await SpecializationModel.findById(specialization_id).lean()
         if (!specialization) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               'Mutaxassislik topilmadi',
            )
         }
         updateData.specialization_id = specialization_id
      }

      if (phone && phone !== worker.phone) {
         const existing = await WorkerModel.findOne({
            phone,
            _id: { $ne: id },
         }).lean()

         if (existing) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               ErrorMessages.PHONE_EXISTS,
            )
         }
         updateData.phone = phone
      }

      await WorkerModel.findByIdAndUpdate(id, { $set: updateData })

      res.status(StatusCodes.OK).json({
         success: true,
         message: 'Xodim muvaffaqiyatli yangilandi',
      })
   })

   public static toggleStatus = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const worker = await WorkerModel.findOne({
         _id: id,
         status: { $ne: 'deleted' },
      }).exec()

      if (!worker) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'Xodim topilmadi',
         )
      }

      const newStatus = worker.status === 'active' ? 'inactive' : 'active'
      await WorkerModel.findByIdAndUpdate(id, { status: newStatus })

      res.status(StatusCodes.OK).json({
         success: true,
         message: `Xodim statusi ${newStatus} holatiga o'zgartirildi`,
      })
   })

   public static delete = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const worker = await WorkerModel.findOne({
         _id: id,
         status: { $ne: 'deleted' },
      }).exec()

      if (!worker) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'Xodim topilmadi',
         )
      }

      await worker.updateOne({ status: 'deleted' }).exec()

      res.status(StatusCodes.OK).json({
         success: true,
         message: "Xodim muvaffaqiyatli o'chirildi",
      })
   })
}

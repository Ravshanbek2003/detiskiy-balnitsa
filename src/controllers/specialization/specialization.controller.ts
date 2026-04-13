import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { ErrorMessages, SuccessMessages } from '../../constants'
import {
   DepartmentModel,
   SpecializationDocumentI,
   SpecializationModel,
} from '../../models'
import { HttpException, asyncHandler } from '../../utils'
import { regexEscape } from '../../utils/regex-escape'

export class SpecializationController {
   public static create = asyncHandler(async (req, res) => {
      const {
         service_code,
         name,
         department_id,
         price_local,
         price_foreign,
         location,
         is_active,
      } = req.body as SpecializationDocumentI

      // Check if department exists
      const department = await DepartmentModel.findById(department_id)
         .lean()
         .exec()
      if (!department) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Bo\\'lim topilmadi!",
         )
      }

      // Check if service code already exists if provided
      if (service_code) {
         const existing = await SpecializationModel.findOne({
            service_code,
         }).lean()

         if (existing) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               "Ushbu xizmat kodiga ega yo\\'nalish allaqachon mavjud!",
            )
         }
      }

      await SpecializationModel.create({
         service_code,
         name,
         department_id,
         price_local,
         price_foreign,
         location,
         is_active,
      })

      res.status(StatusCodes.CREATED).json({
         success: true,
         message: "Yo\\'nalish muvaffaqiyatli yaratildi",
      })
   })

   public static getAll = asyncHandler(async (req, res) => {
      const page = parseInt(req.query.page as string, 10) || 1
      const limit = parseInt(req.query.limit as string, 10) || 20
      const search = (req.query.search as string) || ''
      const is_active = req.query.is_active
      const department_id = req.query.department_id as string

      const queryObj: any = {}

      if (search) {
         const escaped = regexEscape(search)
         queryObj.$or = [
            { name: { $regex: escaped, $options: 'i' } },
            { service_code: { $regex: escaped, $options: 'i' } },
         ]
      }

      if (is_active !== undefined) {
         queryObj.is_active = is_active === 'true'
      }

      if (department_id) {
         queryObj.department_id = department_id
      }

      const [result, total] = await Promise.all([
         SpecializationModel.find(queryObj)
            .populate('department_id', 'name')
            .sort({ created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .exec(),
         SpecializationModel.countDocuments(queryObj).exec(),
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
      const specialization = await SpecializationModel.findById(id)
         .populate('department_id', 'name')
         .lean()
         .exec()

      if (!specialization) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Yo\\'nalish topilmadi",
         )
      }

      res.status(StatusCodes.OK).json({ success: true, data: specialization })
   })

   public static update = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const {
         service_code,
         name,
         department_id,
         price_local,
         price_foreign,
         location,
         is_active,
      } = req.body as Partial<SpecializationDocumentI>

      const specialization = await SpecializationModel.findById(id).exec()

      if (!specialization) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Yo\\'nalish topilmadi",
         )
      }

      if (
         department_id &&
         department_id.toString() !== specialization.department_id.toString()
      ) {
         const department = await DepartmentModel.findById(department_id)
            .lean()
            .exec()
         if (!department) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               "Bo\\'lim topilmadi!",
            )
         }
      }

      if (service_code && service_code !== specialization.service_code) {
         const existing = await SpecializationModel.findOne({
            service_code,
         }).lean()
         if (existing) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               "Ushbu xizmat kodiga ega yo\\'nalish allaqachon mavjud!",
            )
         }
      }

      Object.assign(specialization, {
         ...(service_code !== undefined && { service_code }),
         ...(name !== undefined && { name }),
         ...(department_id !== undefined && { department_id }),
         ...(price_local !== undefined && { price_local }),
         ...(price_foreign !== undefined && { price_foreign }),
         ...(location !== undefined && { location }),
         ...(is_active !== undefined && { is_active }),
      })

      await specialization.save()

      res.status(StatusCodes.OK).json({
         success: true,
         message: "Yo\\'nalish muvaffaqiyatli yangilandi",
      })
   })

   public static delete = asyncHandler(async (req, res) => {
      const { id } = req.params as any

      const specialization = await SpecializationModel.findById(id).exec()

      if (!specialization) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Yo\\'nalish topilmadi",
         )
      }

      specialization.is_active = false
      await specialization.save()

      res.status(StatusCodes.OK).json({
         success: true,
         message: "Yo\\'nalish muvaffaqiyatli o\\'chirildi",
      })
   })

   public static activate = asyncHandler(async (req, res) => {
      const { id } = req.params as any

      const specialization = await SpecializationModel.findById(id).exec()

      if (!specialization) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Yo\\'nalish topilmadi",
         )
      }

      specialization.is_active = true
      await specialization.save()

      res.status(StatusCodes.OK).json({
         success: true,
         message: "Yo\\'nalish muvaffaqiyatli faollashtirildi",
      })
   })
}

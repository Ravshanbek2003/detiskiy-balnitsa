import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { ErrorMessages, SuccessMessages } from '../../constants'
import { DepartmentDocumentI, DepartmentModel } from '../../models'
import { HttpException, asyncHandler } from '../../utils'
import { regexEscape } from '../../utils/regex-escape'

export class DepartmentController {
   public static create = asyncHandler(async (req, res) => {
      const { name, share_percentages, description, is_active } =
         req.body as DepartmentDocumentI

      const existing = await DepartmentModel.findOne({
         name: name,
      }).lean()

      if (existing) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            "Ushbu nomli bo'lim allaqachon mavjud!",
         )
      }

      await DepartmentModel.create({
         name,
         share_percentages,
         description,
         is_active,
      })

      res.status(StatusCodes.CREATED).json({
         success: true,
         message: "Bo'lim muvaffaqiyatli yaratildi",
      })
   })

   public static getAll = asyncHandler(async (req, res) => {
      const page = parseInt(req.query.page as string, 10) || 1
      const limit = parseInt(req.query.limit as string, 10) || 20
      const search = (req.query.search as string) || ''
      const is_active = req.query.is_active

      const queryObj: any = {}

      if (search) {
         const escaped = regexEscape(search)
         queryObj.name = { $regex: escaped, $options: 'i' }
      }

      if (is_active !== undefined) {
         queryObj.is_active = is_active === 'true'
      }

      const [result, total] = await Promise.all([
         DepartmentModel.find(queryObj)
            .sort({ created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .exec(),
         DepartmentModel.countDocuments(queryObj).exec(),
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
      const department = await DepartmentModel.findById(id).lean().exec()

      if (!department) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Bo'lim topilmadi",
         )
      }

      res.status(StatusCodes.OK).json({ success: true, data: department })
   })

   public static update = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const { name, share_percentages, description, is_active } =
         req.body as Partial<DepartmentDocumentI>

      const department = await DepartmentModel.findById(id).exec()

      if (!department) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Bo'lim topilmadi",
         )
      }

      if (name && name !== department.name) {
         const existing = await DepartmentModel.findOne({
            name,
         }).lean()
         if (existing) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               "Ushbu nomli bo'lim allaqachon mavjud!",
            )
         }
      }

      // Xavfsiz yangilash uchun mass array dan foydalanmasdan xossalarni ajratish
      Object.assign(department, {
         ...(name !== undefined && { name }),
         ...(share_percentages !== undefined && { share_percentages }),
         ...(description !== undefined && { description }),
         ...(is_active !== undefined && { is_active }),
      })

      await department.save()

      res.status(StatusCodes.OK).json({
         success: true,
         message: "Bo'lim muvaffaqiyatli yangilandi",
      })
   })

   public static delete = asyncHandler(async (req, res) => {
      const { id } = req.params as any

      const department = await DepartmentModel.findById(id).exec()

      if (!department) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Bo'lim topilmadi",
         )
      }

      const specializationCount = await DepartmentModel.countDocuments({
         department_id: id,
      }).exec()
      if (specializationCount > 0) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            "Bo'limda yo'nalishlar mavjud, bo'limni o'chirish uchun avval yo'nalishlarni o'chiring.",
         )
      }
      department.is_active = false
      await department.save()

      res.status(StatusCodes.OK).json({
         success: true,
         message: "Bo'lim muvaffaqiyatli o'chirildi",
      })
   })

   public static activate = asyncHandler(async (req, res) => {
      const { id } = req.params as any

      const department = await DepartmentModel.findById(id).exec()

      if (!department) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Bo'lim topilmadi",
         )
      }

      department.is_active = true
      await department.save()

      res.status(StatusCodes.OK).json({
         success: true,
         message: "Bo'lim muvaffaqiyatli faollashtirildi",
      })
   })
}

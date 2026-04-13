import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import {
   ErrorMessages,
   RoleConstants,
   StatusConstants,
   SuccessMessages,
} from '../../constants'
import { UserDocumentI, UserModel } from '../../models'
import { HashingHelpers, HttpException, asyncHandler } from '../../utils'
import { regexEscape } from '../../utils/regex-escape'

export class UserController {
   public static create = asyncHandler(async (req, res) => {
      const { fullname, phone, password, role } = req.body as UserDocumentI & {
         password: string
      }

      if (role === RoleConstants.ADMIN) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'Admin roli orqali foydalanuvchi yaratish mumkin emas!',
         )
      }

      const existing = await UserModel.findOne({ phone }).lean()

      if (existing) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            ErrorMessages.PHONE_EXISTS,
         )
      }

      const hashed = await HashingHelpers.generatePassword(password)

      await UserModel.create({
         fullname,
         phone,
         password: hashed,
         role,
         status: StatusConstants.ACTIVE,
      })

      res.status(StatusCodes.CREATED).json({
         success: true,
         message: SuccessMessages.USER_CREATED,
      })
   })

   public static getAll = asyncHandler(async (req, res) => {
      const page = parseInt(req.query.page as string, 10) || 1
      const limit = parseInt(req.query.limit as string, 10) || 20
      const search = (req.query.search as string) || ''
      const role = (req.query.role as string) || ''
      const status = (req.query.status as string) || ''
      const startDate = req.query.startDate as string
      const endDate = req.query.endDate as string

      const queryObj: any = { status: { $ne: StatusConstants.DELETED } }

      if (search) {
         const escaped = regexEscape(search)
         queryObj.$or = [
            { fullname: { $regex: escaped, $options: 'i' } },
            { phone: { $regex: escaped, $options: 'i' } },
         ]
      }

      if (role) {
         queryObj.role = role
      }

      if (status) {
         queryObj.status = status
      }

      if (startDate || endDate) {
         queryObj.created_at = {}
         if (startDate) queryObj.created_at.$gte = new Date(startDate)
         if (endDate) queryObj.created_at.$lte = new Date(endDate)
      }

      const projection = '_id fullname phone role status last_login created_at'

      const [result, total] = await Promise.all([
         UserModel.find(queryObj)
            .select(projection)
            .sort({ created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .exec(),
         UserModel.countDocuments(queryObj).exec(),
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
      const user = await UserModel.findOne({
         _id: id,
         status: { $ne: StatusConstants.DELETED },
      })
         .lean()
         .exec()

      if (!user) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            ErrorMessages.USER_NOT_FOUND,
         )
      }

      res.status(StatusCodes.OK).json({ success: true, data: user })
   })

   public static update = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const { fullname, phone, role, password } = req.body as UserDocumentI & {
         password?: string
      }

      if (role === RoleConstants.ADMIN) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'Admin roli orqali foydalanuvchini yangilash mumkin emas!',
         )
      }

      const user = await UserModel.findOne({
         _id: id,
         status: { $ne: StatusConstants.DELETED },
      })
         .select('+password')
         .exec()

      if (!user) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            ErrorMessages.USER_NOT_FOUND,
         )
      }

      const updateData: any = {}

      if (fullname) updateData.fullname = fullname

      if (phone && phone !== user.phone) {
         const existing = await UserModel.findOne({
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

      if (role) updateData.role = role

      if (password) {
         const isSamePassword = await HashingHelpers.comparePassword(
            password,
            user.password,
         )
         if (!isSamePassword) {
            updateData.password =
               await HashingHelpers.generatePassword(password)
         }
      }

      await UserModel.findByIdAndUpdate(id, { $set: updateData })

      res.status(StatusCodes.OK).json({
         success: true,
         message: SuccessMessages.USER_UPDATED,
      })
   })

   public static toggleBlock = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const user = await UserModel.findOne({
         _id: id,
         status: { $ne: StatusConstants.DELETED },
      }).exec()

      if (!user) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            ErrorMessages.USER_NOT_FOUND,
         )
      }

      const newStatus =
         user.status === StatusConstants.ACTIVE
            ? StatusConstants.BLOCKED
            : StatusConstants.ACTIVE

      await UserModel.findByIdAndUpdate(id, { status: newStatus })

      res.status(StatusCodes.OK).json({
         success: true,
         message:
            newStatus === StatusConstants.BLOCKED
               ? SuccessMessages.USER_BLOCKED
               : SuccessMessages.USER_UNBLOCKED,
      })
   })

   public static delete = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const user = await UserModel.findOne({
         _id: id,
         status: { $ne: StatusConstants.DELETED },
      }).exec()

      if (!user) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            ErrorMessages.USER_NOT_FOUND,
         )
      }

      await user.updateOne({ status: StatusConstants.DELETED }).exec()

      res.status(StatusCodes.OK).json({
         success: true,
         message: SuccessMessages.USER_DELETED,
      })
   })

   // PATCH /user/update-last-login
   public static updateLastLogin = asyncHandler(async (req, res) => {
      const userId = req.user?._id

      if (!userId) {
         throw new HttpException(
            StatusCodes.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED,
            "Avtorizatsiyadan o'tilmagan",
         )
      }

      await UserModel.findByIdAndUpdate(userId, {
         last_login: new Date(),
      })

      res.status(StatusCodes.OK).json({
         success: true,
         message: 'Oxirgi kirish vaqti yangilandi',
      })
   })
}

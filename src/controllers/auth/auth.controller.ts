import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import {
   ErrorMessages,
   RoleConstants,
   StatusConstants,
   SuccessMessages,
} from '../../constants'
import { UserModel } from '../../models'
import {
   HashingHelpers,
   HttpException,
   JwtHelpers,
   REG_KEY,
   asyncHandler,
} from '../../utils'

export class AuthController {
   public static login = asyncHandler(async (req, res) => {
      const login = (req.body.login || req.body.phone || '').trim()
      const { password } = req.body

      const user = await UserModel.findOne({
         phone: login,
         status: { $ne: StatusConstants.DELETED },
      })
         .select('+password')
         .exec()

      if (!user) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            ErrorMessages.INVALID_CREDENTIALS,
         )
      }

      if (user.status === StatusConstants.BLOCKED) {
         throw new HttpException(
            StatusCodes.FORBIDDEN,
            ReasonPhrases.FORBIDDEN,
            ErrorMessages.USER_BLOCKED,
         )
      }

      const isMatch = await HashingHelpers.comparePassword(
         password,
         user.password,
      )

      if (!isMatch) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            ErrorMessages.INVALID_CREDENTIALS,
         )
      }

      await UserModel.findByIdAndUpdate(user._id, {
         last_login: new Date(),
      }).exec()

      const access_token = JwtHelpers.sign(user._id.toString(), user.role, '1d')

      res.status(StatusCodes.OK).json({
         success: true,
         message: SuccessMessages.LOGIN_SUCCESS,
         data: {
            access_token,
            user: {
               _id: user._id,
               fullname: user.fullname,
               phone: user.phone,
               role: user.role,
            },
         },
      })
   })

   public static signUpAdmin = asyncHandler(async (req, res) => {
      const { fullname, phone, password, reg_key } = req.body

      if (reg_key !== REG_KEY) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            "Ro'yxatdan o'tish kaliti noto'g'ri",
         )
      }

      const [existingAdmin, existingPhone] = await Promise.all([
         UserModel.findOne({
            role: RoleConstants.ADMIN,
            status: { $ne: StatusConstants.DELETED },
         }).exec(),
         UserModel.findOne({ phone }).exec(),
      ])

      if (existingAdmin) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            ErrorMessages.ADMIN_EXISTS,
         )
      }

      if (existingPhone) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            ErrorMessages.PHONE_EXISTS,
         )
      }

      const hashedPassword = await HashingHelpers.generatePassword(password)

      await UserModel.create({
         fullname,
         phone,
         role: RoleConstants.ADMIN,
         password: hashedPassword,
         status: StatusConstants.ACTIVE,
      })

      res.status(StatusCodes.CREATED).json({
         success: true,
         message: SuccessMessages.ADMIN_CREATED,
      })
   })

   public static getMe = asyncHandler(async (req, res) => {
      res.status(StatusCodes.OK).json({ success: true, data: req.user })
   })

   public static updateMe = asyncHandler(async (req, res) => {
      const user = req.user
      const { fullname, phone, image } = req.body

      const updateData: {
         fullname?: string
         phone?: string
         image?: string
      } = {}

      if (fullname) updateData.fullname = fullname
      if (image !== undefined) updateData.image = image

      if (phone && phone !== user?.phone) {
         const existing = await UserModel.findOne({
            phone,
            _id: { $ne: user?._id },
         }).exec()

         if (existing) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               ErrorMessages.PHONE_EXISTS,
            )
         }

         updateData.phone = phone
      }

      await UserModel.findByIdAndUpdate(user?._id, {
         $set: updateData,
      }).exec()

      res.status(StatusCodes.OK).json({
         success: true,
         message: SuccessMessages.UPDATED,
      })
   })

   public static updatePassword = asyncHandler(async (req, res) => {
      const hashedPassword = await HashingHelpers.generatePassword(
         req.body.new_password,
      )

      await UserModel.findByIdAndUpdate(req.user?._id, {
         password: hashedPassword,
      }).exec()

      res.status(StatusCodes.OK).json({
         success: true,
         message: SuccessMessages.PASSWORD_UPDATED,
      })
   })
}

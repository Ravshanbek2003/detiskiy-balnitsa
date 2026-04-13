import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { RoleConstants } from '../constants'
import { SubscriberModel } from '../models'
import { asyncHandler } from './async-handler'
import { HttpException } from './http.exception'
import { JwtHelpers } from './jwt.helper'

// Faqat SUBSCRIBER roleli tokenlarni qabul qiladigan middleware
export const subscriberAuthMiddleware = asyncHandler(async (req, res, next) => {
   let token

   if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
   }

   if (!token) {
      throw new HttpException(
         StatusCodes.UNAUTHORIZED,
         ReasonPhrases.UNAUTHORIZED,
         ReasonPhrases.UNAUTHORIZED,
      )
   }

   const decoded = JwtHelpers.verify(token) as { id: string; role: string }

   if (!decoded?.id || decoded.role !== RoleConstants.SUBSCRIBER) {
      throw new HttpException(
         StatusCodes.FORBIDDEN,
         ReasonPhrases.FORBIDDEN,
         'Sizga ruxsat berilmagan',
      )
   }

   const subscriber = await SubscriberModel.findById(decoded.id)

   if (!subscriber) {
      throw new HttpException(
         StatusCodes.NOT_FOUND,
         ReasonPhrases.NOT_FOUND,
         'Abonent topilmadi',
      )
   }

   req.user = subscriber as any

   next()
})

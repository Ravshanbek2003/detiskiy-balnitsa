import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { NextFunction, Request, Response } from 'express'

import { RoleConstantsType } from '../types'
import { HttpException } from '../utils/http.exception'
import { CustomRequest, noAsyncHandler } from './async-handler'

export const roleMiddleware = (allowedRoles?: RoleConstantsType[]) =>
   noAsyncHandler((req: CustomRequest, res: Response, next: NextFunction) => {
      const role = req?.user?.role
      if (!role) {
         throw new HttpException(
            StatusCodes.FORBIDDEN,
            ReasonPhrases.FORBIDDEN,
            'You are not allowed!',
         )
      }
      if (
         allowedRoles &&
         allowedRoles.length > 0 &&
         !allowedRoles.includes(role)
      ) {
         throw new HttpException(
            StatusCodes.FORBIDDEN,
            ReasonPhrases.FORBIDDEN,
            'You are not allowed!',
         )
      }
      next()
   })

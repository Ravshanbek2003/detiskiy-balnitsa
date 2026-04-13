import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { MulterError } from 'multer'

import { NextFunction, Request, Response } from 'express'

import { HttpException } from './http.exception'

export const errorMiddleware = (
   error: HttpException | MulterError | Error,
   req: Request,
   res: Response,
   next: NextFunction,
): any => {
   // Handle Multer-specific errors
   if (error instanceof MulterError) {
      let msg = 'Fayl yuklashda xatolik'
      let statusCode = StatusCodes.BAD_REQUEST

      switch (error.code) {
         case 'LIMIT_FILE_SIZE':
            msg = 'Fayl hajmi juda katta. Maksimal 50 MB'
            break
         case 'LIMIT_FILE_COUNT':
            msg = "Fayllar soni juda ko'p. Maksimal 10 ta fayl"
            break
         case 'LIMIT_UNEXPECTED_FILE':
            msg = 'Kutilmagan fayl maydoni'
            break
         case 'LIMIT_PART_COUNT':
            msg = "Formada juda ko'p qismlar"
            break
         default:
            msg = error.message
      }

      return res.status(statusCode).json({
         success: false,
         error: {
            statusCode,
            statusMsg: ReasonPhrases.BAD_REQUEST,
            msg,
         },
      })
   }

   // Handle HttpException
   if (error instanceof HttpException) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
      const statusMsg = error.statusMsg || ReasonPhrases.INTERNAL_SERVER_ERROR
      const msg = error.msg || error.message || ReasonPhrases.GATEWAY_TIMEOUT

      // Log error for debugging (but don't crash the server)
      if (statusCode >= 500) {
         console.error('Server Error:', {
            statusCode,
            statusMsg,
            msg,
            stack: error.stack,
            url: req.url,
            method: req.method,
         })
      }

      return res.status(statusCode).json({
         success: false,
         error: {
            statusCode,
            statusMsg,
            msg,
         },
      })
   }

   // Handle generic errors
   const statusCode = StatusCodes.INTERNAL_SERVER_ERROR
   const statusMsg = ReasonPhrases.INTERNAL_SERVER_ERROR
   const msg = error.message || ReasonPhrases.INTERNAL_SERVER_ERROR

   console.error('Unexpected Error:', {
      statusCode,
      statusMsg,
      msg,
      stack: error.stack,
      url: req.url,
      method: req.method,
   })

   return res.status(statusCode).json({
      success: false,
      error: {
         statusCode,
         statusMsg,
         msg,
      },
   })
}

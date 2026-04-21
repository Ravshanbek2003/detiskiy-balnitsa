import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { SalaryLogModel } from '../../models'
import { HttpException, asyncHandler } from '../../utils'

export class SalaryLogController {
   public static getAll = asyncHandler(async (req, res) => {
      const page = parseInt(req.query.page as string, 10) || 1
      const limit = parseInt(req.query.limit as string, 10) || 20
      const salary_month = (req.query.salary_month as string) || ''
      const worker_id = (req.query.worker_id as string) || ''
      const search = (req.query.search as string) || ''

      const queryObj: any = {}

      if (salary_month) queryObj.salary_month = salary_month
      if (worker_id) queryObj.worker_id = worker_id

      queryObj.worker_type = 'doctor' // only return doctor salary logs

      // Worker nomiga asosan direct search
      if (search) {
         queryObj.worker_fullname = { $regex: search, $options: 'i' }
      }

      const [result, total] = await Promise.all([
         SalaryLogModel.find(queryObj)
            .populate({
               path: 'worker_id',
               select:
                  '_id fullname phone worker_type department_id specialization_id status',
            })
            .sort({ month_date: -1, created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .exec(),
         SalaryLogModel.countDocuments(queryObj).exec(),
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

      const salaryLog = await SalaryLogModel.findById(id)
         .populate({
            path: 'worker_id',
            select:
               '_id fullname phone worker_type department_id specialization_id status',
         })
         .lean()
         .exec()

      if (!salaryLog) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'Oylik log topilmadi',
         )
      }

      res.status(StatusCodes.OK).json({
         success: true,
         data: salaryLog,
      })
   })
}

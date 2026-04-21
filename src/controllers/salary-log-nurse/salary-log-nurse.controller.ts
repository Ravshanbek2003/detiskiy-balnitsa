import { Types } from 'mongoose'

import { Request, Response } from 'express'

import { SalaryLogNurseModel } from '../../models'
import { asyncHandler } from '../../utils'

export class SalaryLogNurseController {
   public static getAll = asyncHandler(async (req: Request, res: Response) => {
      const {
         page = 1,
         limit = 10,
         department_id,
         worker_type,
         salary_month,
         start_date,
         end_date,
      } = req.query

      const filter: any = {}

      if (department_id) {
         filter.department_id = new Types.ObjectId(department_id as string)
      }

      if (worker_type) {
         filter.worker_type = worker_type
      }

      if (salary_month) {
         filter.salary_month = salary_month
      }

      if (start_date || end_date) {
         filter.month_date = {}
         if (start_date) {
            filter.month_date.$gte = new Date(start_date as string)
         }
         if (end_date) {
            filter.month_date.$lte = new Date(end_date as string)
         }
      }

      const skip = (+page - 1) * Number(limit)

      const [data, total] = await Promise.all([
         SalaryLogNurseModel.find(filter)
            .sort({ month_date: -1, created_at: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean()
            .exec(),
         SalaryLogNurseModel.countDocuments(filter),
      ])

      // Calculate summary for given filter
      const summaryData = await SalaryLogNurseModel.aggregate([
         { $match: filter },
         {
            $group: {
               _id: null,
               total_amount: { $sum: '$amount' },
               total_patient_count: { $sum: '$all_patient_count' },
            },
         },
      ])

      res.json({
         success: true,
         data,
         summary: summaryData[0] || { total_amount: 0, total_patient_count: 0 },
         pagination: {
            page: +page,
            limit: +limit,
            total,
            total_pages: Math.ceil(total / Number(limit)),
            has_next_page: +page * Number(limit) < total,
            has_prev_page: +page > 1,
            next_page: +page * Number(limit) < total ? +page + 1 : null,
            prev_page: +page > 1 ? +page - 1 : null,
         },
      })
   })

   public static getById = asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params

      const data = await SalaryLogNurseModel.findById(id).lean()

      if (!data) {
         return res.status(404).json({
            success: false,
            message: 'Hamshira maoshi logi topilmadi',
         })
      }

      res.json({
         success: true,
         data,
      })
   })
}

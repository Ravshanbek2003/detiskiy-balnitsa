import { Types } from 'mongoose'

import { NextFunction, Request, Response } from 'express'

import { SalaryLogNurseModel } from '../../models'
import { asyncHandler } from '../../utils'

export class SalaryLogNurseController {
   public static getAll = asyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
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
            SalaryLogNurseModel.aggregate([
               { $match: filter },
               { $sort: { month_date: -1, created_at: -1 } },
               { $skip: skip },
               { $limit: Number(limit) },
               {
                  $lookup: {
                     from: 'departments',
                     localField: 'department_id',
                     foreignField: '_id',
                     as: 'department',
                  },
               },
               {
                  $unwind: {
                     path: '$department',
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $project: {
                     _id: 1,
                     department_id: 1,
                     department_name: '$department.name',
                     worker_type: 1,
                     salary_month: 1,
                     month_date: 1,
                     all_patient_count: 1,
                     amount: 1,
                     created_at: 1,
                     updated_at: 1,
                  },
               },
            ]),
            SalaryLogNurseModel.countDocuments(filter),
         ])

         // Calculate summary for given filter
         const [summary] = await SalaryLogNurseModel.aggregate([
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
            summary: summary || { total_amount: 0, total_patient_count: 0 },
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
      },
   )

   public static getById = asyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
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
      },
   )
}

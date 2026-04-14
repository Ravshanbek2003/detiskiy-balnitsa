import { StatusCodes } from 'http-status-codes'

import {
   DepartmentModel,
   PatientModel,
   SpecializationModel,
   WorkerModel,
} from '../../models'
import { asyncHandler } from '../../utils'

export class MainController {
   public static getTodayDashboard = asyncHandler(async (req, res) => {
      // Bugungi sana oralig'i (00:00:00 dan 23:59:59 gacha)
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)

      // Barcha ifodalarni BIR VAQTDA (Concurrent) ishlatib server ishini 3-4 barobarga tezlashtiramiz
      const [
         cashiersAggregation,
         workersAggregation,
         total_departments,
         total_specializations,
      ] = await Promise.all([
         // 1. Bugungi bemorlar va kassa hisoboti
         PatientModel.aggregate([
            {
               $match: {
                  created_at: { $gte: startOfDay, $lte: endOfDay },
                  payment_status: 'paid',
               },
            },
            {
               $group: {
                  _id: '$created_by', // kassir ID si
                  total_income: { $sum: '$amount' },
                  patients_count: { $sum: 1 },
               },
            },
            {
               $lookup: {
                  from: 'users',
                  localField: '_id',
                  foreignField: '_id',
                  as: 'cashier_info',
               },
            },
            {
               $unwind: {
                  path: '$cashier_info',
                  preserveNullAndEmptyArrays: true,
               },
            },
            {
               $project: {
                  _id: 0,
                  cashier_id: '$_id',
                  cashier_name: {
                     $ifNull: ['$cashier_info.fullname', "Noma'lum"],
                  },
                  cashier_login: {
                     $ifNull: ['$cashier_info.login', "Noma'lum"],
                  },
                  total_income: 1,
                  patients_count: 1,
               },
            },
         ]),

         // 2. Ishchilar statistikasi (Aktiv bo'lganlari)
         WorkerModel.aggregate([
            { $match: { status: 'active' } },
            {
               $group: {
                  _id: '$worker_type',
                  count: { $sum: 1 },
               },
            },
         ]),

         // 3. Bo'limlar soni
         DepartmentModel.countDocuments({ status: 'active' }),

         // 4. Yo'nalishlar soni
         SpecializationModel.countDocuments({ status: 'active' }),
      ])

      // Olingan ma'lumotlarni hisoblash/tizish qismi (Synchronous - bu yerga kutish vaqti ketmaydi)
      let total_all_income = 0
      let total_patients_count = 0

      cashiersAggregation.forEach(report => {
         total_all_income += report.total_income
         total_patients_count += report.patients_count
      })

      const total_workers = {
         doctor: 0,
         nurse: 0,
         assistant_nurse: 0,
         total: 0,
      }

      workersAggregation.forEach(w => {
         if (w._id === 'doctor') total_workers.doctor = w.count
         if (w._id === 'nurse') total_workers.nurse = w.count
         if (w._id === 'assistant_nurse')
            total_workers.assistant_nurse = w.count
         total_workers.total += w.count
      })

      res.status(StatusCodes.OK).json({
         success: true,
         message: 'Bugungi kassa va umumiy hisobotlar muvaffaqiyatli olindi',
         data: {
            total_all_income,
            total_patients_count,
            cashiers_report: cashiersAggregation,
            total_workers,
            total_departments,
            total_specializations,
         },
      })
   })

   private static parseDates(query: any) {
      let start = new Date()
      start.setHours(0, 0, 0, 0)
      
      let end = new Date()
      end.setHours(23, 59, 59, 999)

      if (query.start_date) {
         start = new Date(query.start_date)
         start.setHours(0, 0, 0, 0)
      }
      if (query.end_date) {
         end = new Date(query.end_date)
         end.setHours(23, 59, 59, 999)
      }
      return { start, end }
   }

   // 1. Umumiy moliya, to'lov turlari va kunlik dinamika
   public static getRevenueSummary = asyncHandler(async (req, res) => {
      const { start, end } = MainController.parseDates(req.query)

      const matchStage = { created_at: { $gte: start, $lte: end }, payment_status: 'paid' }

      const [paymentMethods, dailyDynamics, summary] = await Promise.all([
         PatientModel.aggregate([
            { $match: matchStage },
            { $group: { _id: '$payment_method', total: { $sum: '$amount' }, count: { $sum: 1 } } }
         ]),
         PatientModel.aggregate([
            { $match: matchStage },
            { $group: {
               _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
               total_income: { $sum: '$amount' },
               patients_count: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
         ]),
         PatientModel.aggregate([
            { $match: matchStage },
            { $group: { _id: null, total_income: { $sum: '$amount' }, total_patients: { $sum: 1 } } }
         ])
      ])

      res.status(StatusCodes.OK).json({
         success: true,
         message: "Hisobot olindi",
         data: {
            start_date: start,
            end_date: end,
            summary: summary[0] || { total_income: 0, total_patients: 0 },
            payment_methods: paymentMethods.map(p => ({ method: p._id, total: p.total, count: p.count })),
            daily_dynamics: dailyDynamics.map(d => ({ date: d._id, total_income: d.total_income, patients_count: d.patients_count }))
         }
      })
   })

   // 2. Shifokorlar kesimida tushumlar
   public static getDoctorsReport = asyncHandler(async (req, res) => {
      const { start, end } = MainController.parseDates(req.query)
      
      const doctorsReport = await PatientModel.aggregate([
         { $match: { created_at: { $gte: start, $lte: end }, payment_status: 'paid', doctor: { $exists: true, $ne: null } } },
         { $group: {
            _id: '$doctor',
            doctor_name: { $first: '$doctor_name' },
            total_income: { $sum: '$amount' },
            patients_count: { $sum: 1 }
         }},
         { $sort: { total_income: -1 } }
      ])

      res.status(StatusCodes.OK).json({ success: true, message: "Shifokorlar bo'yicha hisobot olingan", data: doctorsReport })
   })

   // 3. Yo'nalishlar (Specializations) kesimida tushumlar
   public static getSpecializationsReport = asyncHandler(async (req, res) => {
      const { start, end } = MainController.parseDates(req.query)
      
      const specsReport = await PatientModel.aggregate([
         { $match: { created_at: { $gte: start, $lte: end }, payment_status: 'paid' } },
         { $group: {
            _id: '$specialization_id',
            specialization_name: { $first: '$specialization_name' },
            total_income: { $sum: '$amount' },
            patients_count: { $sum: 1 }
         }},
         { $sort: { total_income: -1 } }
      ])

      res.status(StatusCodes.OK).json({ success: true, message: "Yo'nalishlar bo'yicha hisobot olingan", data: specsReport })
   })

   // 4. Xodimlar (Hamshira va yordamchilar) kesimida bemorlar
   public static getWorkersReport = asyncHandler(async (req, res) => {
      const { start, end } = MainController.parseDates(req.query)
      
      const nursesReport = await PatientModel.aggregate([
         { $match: { created_at: { $gte: start, $lte: end }, payment_status: 'paid', nurse: { $exists: true, $ne: null } } },
         { $group: {
            _id: '$nurse',
            nurse_name: { $first: '$nurse_name' },
            total_income: { $sum: '$amount' },
            patients_count: { $sum: 1 }
         }},
         { $sort: { total_income: -1 } }
      ])

      res.status(StatusCodes.OK).json({ success: true, message: "Hamshiralar bo'yicha hisobot olingan", data: nursesReport })
   })


   
}
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import {
   DepartmentModel,
   LogModel,
   PatientDocumentI,
   PatientModel,
   SalaryLogNurseModel,
   SpecializationModel,
   WorkerModel,
} from '../../models'
import {
   HttpException,
   asyncHandler,
   syncNurseSalaryLogsForMonth,
   syncSalaryLogsForMonth,
} from '../../utils'
import { regexEscape } from '../../utils/regex-escape'

export class PatientController {
   public static create = asyncHandler(async (req, res) => {
      const {
         full_name,
         check_number,
         department_id,
         department_name,
         specialization_id,
         specialization_name,
         doctor,
         doctor_name,
         amount,
         payment_method,
         payment_status,
         country,
      } = req.body as PatientDocumentI
      const created_by = req.user?._id

      // Check if check_number already exists
      const existing = await PatientModel.findOne({ check_number }).lean()

      if (existing) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            "Ushbu chek raqamiga ega bemor ro\\'yxatdan o\\'tgan!",
         )
      }

      // To'liq tekshirishlar
      const department = await DepartmentModel.findById(department_id).lean()
      if (!department) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Bo\\'lim topilmadi!",
         )
      }

      const specialization =
         await SpecializationModel.findById(specialization_id).lean()
      if (!specialization) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Yo\\'nalish topilmadi!",
         )
      }

      if (doctor) {
         const doctorDoc = await WorkerModel.findOne({
            _id: doctor,
            worker_type: 'doctor',
         }).lean()
         if (!doctorDoc) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               'Shifokor topilmadi!',
            )
         }
      }

      // Concurrent: Create patient va increment worker patient counts
      const updatePromises: Promise<any>[] = []
      if (doctor) {
         updatePromises.push(
            WorkerModel.findByIdAndUpdate(doctor, {
               $inc: { today_patients_count: 1 },
               $set: { last_patient_at: new Date() },
            }).exec(),
         )
      }

      const patient = await PatientModel.create({
         full_name,
         check_number,
         department_id,
         department_name,
         department_share_percentages: department.share_percentages,
         specialization_id,
         specialization_name,
         doctor,
         doctor_name,
         amount,
         payment_method,
         payment_status,
         country,
         created_by,
         created_by_fullname: req.user?.fullname,
      })

      await Promise.all(updatePromises)

      // Fire-and-forget salary log sync (debounced, non-blocking)
      syncSalaryLogsForMonth(patient.created_at)
      syncNurseSalaryLogsForMonth(patient.created_at)

      res.status(StatusCodes.CREATED).json({
         success: true,
         message: "Bemor muvaffaqiyatli ro\\'yxatga olindi",
      })
   })

   public static getAll = asyncHandler(async (req, res) => {
      const page = parseInt(req.query.page as string, 10) || 1
      const limit = parseInt(req.query.limit as string, 10) || 20
      const search = (req.query.search as string) || ''
      const department_id = req.query.department_id as string
      const specialization_id = req.query.specialization_id as string
      const payment_method = req.query.payment_method as string
      const payment_status = req.query.payment_status as string
      const country = req.query.country as string
      const created_by = req.query.created_by as string
      const start_date = req.query.start_date as string
      const end_date = req.query.end_date as string

      const queryObj: any = {}

      if (search) {
         const escaped = regexEscape(search)
         queryObj.$or = [
            { full_name: { $regex: escaped, $options: 'i' } },
            { check_number: { $regex: escaped, $options: 'i' } },
         ]
      }

      if (department_id) queryObj.department_id = department_id
      if (specialization_id) queryObj.specialization_id = specialization_id
      if (payment_method) queryObj.payment_method = payment_method
      if (payment_status) queryObj.payment_status = payment_status
      if (country) queryObj.country = country
      if (created_by) queryObj.created_by = created_by
      if (start_date || end_date) {
         queryObj.created_at = {}

         if (start_date) {
            const start = new Date(start_date)
            start.setHours(0, 0, 0, 0)
            queryObj.created_at.$gte = start
         }

         if (end_date) {
            const end = new Date(end_date)
            end.setHours(23, 59, 59, 999)
            queryObj.created_at.$lte = end
         }
      } else {
         const start = new Date()
         start.setHours(0, 0, 0, 0)

         const end = new Date()
         end.setHours(23, 59, 59, 999)

         queryObj.created_at = {
            $gte: start,
            $lte: end,
         }
      }

      const [result, total] = await Promise.all([
         PatientModel.find(queryObj)
            .sort({ created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .exec(),
         PatientModel.countDocuments(queryObj).exec(),
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
      const patient = await PatientModel.findById(id).lean().exec()

      if (!patient) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'Bemor topilmadi',
         )
      }

      res.status(StatusCodes.OK).json({ success: true, data: patient })
   })

   public static update = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const {
         full_name,
         check_number,
         department_id,
         department_name,
         specialization_id,
         specialization_name,
         doctor,
         doctor_name,
         amount,
         payment_method,
         payment_status,
         country,
      } = req.body as Partial<PatientDocumentI>

      const patient = await PatientModel.findById(id).exec()

      if (!patient) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'Bemor topilmadi',
         )
      }

      const previousDoctor = patient.doctor?.toString()
      const salaryLogMonthDate = patient.created_at

      if (check_number && check_number !== patient.check_number) {
         const existing = await PatientModel.findOne({ check_number }).lean()
         if (existing) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               "Ushbu chek raqamiga ega bemor ro\\'yxatdan o\\'tgan!",
            )
         }
      }

      // To'liq tekshirishlar (Update)
      if (department_id) {
         const department = await DepartmentModel.findById(department_id).lean()
         if (!department) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               "Bo\\'lim topilmadi!",
            )
         }
      }

      if (specialization_id) {
         const specialization =
            await SpecializationModel.findById(specialization_id).lean()
         if (!specialization) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               "Yo\\'nalish topilmadi!",
            )
         }
      }

      if (doctor) {
         const doctorDoc = await WorkerModel.findOne({
            _id: doctor,
            worker_type: 'doctor',
         }).lean()
         if (!doctorDoc) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               'Shifokor topilmadi!',
            )
         }
      }

      Object.assign(patient, {
         ...(full_name !== undefined && { full_name }),
         ...(check_number !== undefined && { check_number }),
         ...(department_id !== undefined && { department_id }),
         ...(department_name !== undefined && { department_name }),
         ...(specialization_id !== undefined && { specialization_id }),
         ...(specialization_name !== undefined && { specialization_name }),
         ...(doctor !== undefined && { doctor }),
         ...(doctor_name !== undefined && { doctor_name }),
         ...(amount !== undefined && { amount }),
         ...(payment_method !== undefined && { payment_method }),
         ...(payment_status !== undefined && { payment_status }),
         ...(country !== undefined && { country }),
      })

      // Handle worker patient count updates if doctor or nurse changed
      const updatePromises: Promise<any>[] = []

      if (doctor !== undefined && previousDoctor !== doctor?.toString()) {
         // Eski doctor sanini kamaytir
         if (previousDoctor) {
            updatePromises.push(
               WorkerModel.findByIdAndUpdate(previousDoctor, {
                  $inc: { today_patients_count: -1 },
               }).exec(),
            )
         }
         // Yangi doctor sanini oshir
         if (doctor) {
            updatePromises.push(
               WorkerModel.findByIdAndUpdate(doctor, {
                  $inc: { today_patients_count: 1 },
                  $set: { last_patient_at: new Date() },
               }).exec(),
            )
         }
      }

      await patient.save()
      await Promise.all(updatePromises)

      // Fire-and-forget salary log sync (debounced, non-blocking)
      syncSalaryLogsForMonth(salaryLogMonthDate)
      syncNurseSalaryLogsForMonth(salaryLogMonthDate)

      res.status(StatusCodes.OK).json({
         success: true,
         message: "Bemor ma\\'lumotlari muvaffaqiyatli yangilandi",
      })
   })

   public static delete = asyncHandler(async (req, res) => {
      const { id } = req.params as any

      const patient = await PatientModel.findById(id).exec()

      if (!patient) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'Bemor topilmadi',
         )
      }

      await PatientModel.deleteOne({ _id: id })

      // Log deletion
      LogModel.create({
         type: 'DELETE_PATIENT',
         content: `Bemor o'chirildi: ${patient.full_name} (ID: ${patient._id})`,
      }).catch(error => console.error('Log creation failed:', error))

      // Fire-and-forget salary log sync (debounced, non-blocking)
      syncSalaryLogsForMonth(patient.created_at)
      syncNurseSalaryLogsForMonth(patient.created_at)

      res.status(StatusCodes.OK).json({
         success: true,
         message: "Bemor qaydi muvaffaqiyatli o\\'chirildi",
      })
   })

   public static updatePaymentStatus = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const { payment_status } = req.body as {
         payment_status: 'paid' | 'unpaid'
      }

      const patient = await PatientModel.findById(id).exec()

      if (!patient) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'Bemor topilmadi',
         )
      }

      patient.payment_status = payment_status
      await patient.save()

      // Fire-and-forget salary log sync (debounced, non-blocking)
      syncSalaryLogsForMonth(patient.created_at)
      syncNurseSalaryLogsForMonth(patient.created_at)

      res.status(StatusCodes.OK).json({
         success: true,
         message: "To\\'lov holati muvaffaqiyatli yangilandi",
      })
   })
}

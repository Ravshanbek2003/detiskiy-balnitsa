import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import {
   DepartmentModel,
   LogModel,
   PatientDocumentI,
   PatientModel,
   SpecializationModel,
   WorkerModel,
} from '../../models'
import { HttpException, asyncHandler } from '../../utils'
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
         nurse,
         nurse_name,
         amount,
         payment_method,
         payment_status,
      } = req.body as PatientDocumentI

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

      if (nurse) {
         const nurseDoc = await WorkerModel.findOne({
            _id: nurse,
            worker_type: { $in: ['nurse', 'assistant_nurse'] },
         }).lean()
         if (!nurseDoc) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               'Hamshira topilmadi!',
            )
         }
      }

      await PatientModel.create({
         full_name,
         check_number,
         department_id,
         department_name,
         specialization_id,
         specialization_name,
         doctor,
         doctor_name,
         nurse,
         nurse_name,
         amount,
         payment_method,
         payment_status,
      })

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
         nurse,
         nurse_name,
         amount,
         payment_method,
         payment_status,
      } = req.body as Partial<PatientDocumentI>

      const patient = await PatientModel.findById(id).exec()

      if (!patient) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'Bemor topilmadi',
         )
      }

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

      if (nurse) {
         const nurseDoc = await WorkerModel.findOne({
            _id: nurse,
            worker_type: { $in: ['nurse', 'assistant_nurse'] },
         }).lean()
         if (!nurseDoc) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               'Hamshira topilmadi!',
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
         ...(nurse !== undefined && { nurse }),
         ...(nurse_name !== undefined && { nurse_name }),
         ...(amount !== undefined && { amount }),
         ...(payment_method !== undefined && { payment_method }),
         ...(payment_status !== undefined && { payment_status }),
      })

      await patient.save()

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
      await LogModel.create({
         type: 'DELETE_PATIENT',
         content: `Bemor o'chirildi: ${patient.full_name} (ID: ${patient._id})`,
      })

      //   bu yerda log model yaratilishi kerak

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

      res.status(StatusCodes.OK).json({
         success: true,
         message: "To\\'lov holati muvaffaqiyatli yangilandi",
      })
   })
}

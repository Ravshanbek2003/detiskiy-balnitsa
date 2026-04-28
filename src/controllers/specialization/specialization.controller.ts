import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { ErrorMessages, SuccessMessages } from '../../constants'
import {
   DepartmentModel,
   SpecializationDocumentI,
   SpecializationModel,
} from '../../models'
import { HttpException, asyncHandler } from '../../utils'
import { regexEscape } from '../../utils/regex-escape'

const data_big = [
   {
      service_code: 'MED.40.0025',
      name: "Kardiorevmatolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 50000,
      price_foreign: 62000,
      location: { building: '1 qavatli bino', floor: 1, room: '1' },
   },
   {
      service_code: 'MED.40.0022',
      name: "Nevropatolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 50000,
      price_foreign: 62000,
      location: { building: '1 qavatli bino', floor: 1, room: '10' },
   },
   {
      service_code: 'MED.40.0018',
      name: "Pediatr ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 55000,
      price_foreign: 68000,
      location: { building: '1 qavatli bino', floor: 1, room: '8' },
   },
   {
      service_code: 'MED.40.0029',
      name: "Pulmonolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 55000,
      price_foreign: 68000,
      location: { building: '1 qavatli bino', floor: 1, room: '1' },
   },
   {
      service_code: 'MED.40.0037',
      name: "Allergolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 55000,
      price_foreign: 68000,
      location: { building: '1 qavatli bino', floor: 1, room: '3' },
   },
   {
      service_code: 'MED.40.0023',
      name: "Nefrolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 53000,
      price_foreign: 66000,
      location: { building: '1 qavatli bino', floor: 1, room: '2' },
   },
   {
      service_code: 'MED.40.0026',
      name: "Gematolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 50000,
      price_foreign: 62000,
      location: { building: '1 qavatli bino', floor: 1, room: '1' },
   },
   {
      service_code: 'MED.40.0030',
      name: "Gastroenterolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 53000,
      price_foreign: 66000,
      location: { building: '1 qavatli bino', floor: 1, room: '2' },
   },
   {
      service_code: 'MED.40.0045',
      name: "Travmatolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 60000,
      price_foreign: 75000,
      location: { building: '1 qavatli bino', floor: 1, room: '13' },
   },
   {
      service_code: 'MED.40.0058',
      name: 'Urolog kurigi',
      department_id: '69ef2768535b2ad865bda392',
      price_local: 60000,
      price_foreign: 75000,
      location: { building: '1 qavatli bino', floor: 1, room: '8' },
   },
   {
      service_code: 'FRA.25.0096',
      name: "Abdominal xirurg ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 55000,
      price_foreign: 68000,
      location: { building: '1 qavatli bino', floor: 1, room: '8' },
   },
   {
      service_code: 'EAR.03.0028',
      name: "LOR ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 50000,
      price_foreign: 62000,
      location: { building: '1 qavatli bino', floor: 1, room: '12' },
   },
   {
      service_code: 'MED.40.0048',
      name: "Xirurg ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 55000,
      price_foreign: 68000,
      location: { building: '1 qavatli bino', floor: 1, room: '8' },
   },
   {
      service_code: 'MED.40.0052',
      name: "Neyroxirurg ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 55000,
      price_foreign: 68000,
      location: { building: '1 qavatli bino', floor: 1, room: '10' },
   },
   {
      service_code: 'MED.40.0080',
      name: "Stomatolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 45000,
      price_foreign: 56000,
      location: { building: '1 qavatli bino', floor: 1, room: '14' },
   },
   {
      service_code: 'MED.40.0044',
      name: "Yiring xirurgiya va proktolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 55000,
      price_foreign: 68000,
      location: { building: '1 qavatli bino', floor: 1, room: '8' },
   },
   {
      service_code: 'MED.40.0064',
      name: "Anesteziolog-reanimatolog vrach ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 60000,
      price_foreign: 75000,
      location: { building: '1 qavatli bino', floor: 1, room: '9' },
   },
   {
      service_code: 'MED.40.0067',
      name: "Fizioterapevt vrach ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 50000,
      price_foreign: 62000,
      location: { building: '1 qavatli bino', floor: 1, room: '3' },
   },
   {
      service_code: 'MED.40.0014',
      name: "Infektsionist vrach ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 50000,
      price_foreign: 62000,
      location: { building: '1 qavatli bino', floor: 1, room: '3' },
   },
   {
      service_code: 'MED.40.0019',
      name: "Neonatolog vrach ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 55000,
      price_foreign: 68000,
      location: { building: '1 qavatli bino', floor: 1, room: '3' },
   },
   {
      service_code: 'MED.40.0081',
      name: "Yuz jag-xirurgi vrach ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 55000,
      price_foreign: 68000,
      location: { building: '1 qavatli bino', floor: 1, room: '6' },
   },
   {
      service_code: 'MED.40.0061',
      name: "Umumiy ginekolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 55000,
      price_foreign: 68000,
      location: { building: '1 qavatli bino', floor: 1, room: '4' },
   },
   {
      service_code: 'MED.40.0060',
      name: "Oftalmolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 50000,
      price_foreign: 62000,
      location: { building: '1 qavatli bino', floor: 1, room: '15' },
   },
   {
      service_code: 'FDG.43.0001',
      name: "Defektolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 60000,
      price_foreign: 75000,
      location: { building: '1 qavatli bino', floor: 1, room: '4' },
   },
   {
      service_code: 'SHS.26.0018',
      name: "Logoped ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 75000,
      price_foreign: 93000,
      location: { building: '1 qavatli bino', floor: 1, room: '4' },
   },
   {
      service_code: 'MED.40.0060',
      name: "Immunolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 55000,
      price_foreign: 68000,
      location: { building: '1 qavatli bino', floor: 1, room: '3' },
   },
   {
      service_code: 'NIR.34.0014',
      name: 'Muolaja xamshira (katta muolaja uchun)',
      department_id: '69ef2768535b2ad865bda392',
      price_local: 30000,
      price_foreign: 37000,
      location: { building: '1 qavatli bino', floor: 1, room: '11' },
   },
   {
      service_code: 'NIR.34.0014',
      name: 'Muolaja xamshira (kichik muolaja uchun)',
      department_id: '69ef2768535b2ad865bda392',
      price_local: 10000,
      price_foreign: 12000,
      location: { building: '1 qavatli bino', floor: 1, room: '11' },
   },
   {
      service_code: 'MED.40.0055',
      name: "Travmatolog gipsi qo'yish va olish bolalar uchun (davolash)",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 215000,
      price_foreign: 268000,
      location: { building: '1 qavatli bino', floor: 1, room: '2' },
   },
   {
      service_code: null,
      name: "Travmatolog gipsi qo'yish va olish katta uchun (davolash)",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 500000,
      price_foreign: 625000,
      location: { building: '1 qavatli bino', floor: 1, room: '2' },
   },
   {
      service_code: 'MED.40.0060',
      name: "Oftalmolog ko'rigi (davolash)",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 60000,
      price_foreign: 75000,
      location: { building: '1 qavatli bino', floor: 1, room: '15' },
   },
   {
      service_code: 'MED.40.0059',
      name: "LOR ko'rigi (davolash)",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 70000,
      price_foreign: 87000,
      location: { building: '1 qavatli bino', floor: 1, room: '12' },
   },
   {
      service_code: 'MED.40.0078',
      name: 'Shillik kavat kasallik (Stomatit) bir katnov uchun',
      department_id: '69ef2768535b2ad865bda392',
      price_local: 85000,
      price_foreign: 106000,
      location: { building: '1 qavatli bino', floor: 1, room: '14' },
   },
   {
      service_code: 'MED.40.0085',
      name: "O'rta karies",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 115000,
      price_foreign: 143000,
      location: { building: '1 qavatli bino', floor: 1, room: '14' },
   },
   {
      service_code: 'MED.40.0077',
      name: "O'tkir pulpit (Bir ildizli) 1-katnov",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 73000,
      price_foreign: 91000,
      location: { building: '1 qavatli bino', floor: 1, room: '14' },
   },
   {
      service_code: null,
      name: 'Nebulayzer ingalyator (ingolyatsiya uchun)',
      department_id: '69ef2768535b2ad865bda392',
      price_local: 43000,
      price_foreign: 53000,
      location: { building: '1 qavatli bino', floor: 1, room: '11' },
   },
   {
      service_code: 'MED.40.0021',
      name: "Onkolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 45000,
      price_foreign: 56000,
      location: { building: '1 qavatli bino', floor: 1, room: '15' },
   },
   {
      service_code: 'MED.40.0034',
      name: "Endokrinolog ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 45000,
      price_foreign: 56000,
      location: { building: '1 qavatli bino', floor: 1, room: '15' },
   },
   {
      service_code: 'MED.40.0039',
      name: "Psixiatr ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 45000,
      price_foreign: 56000,
      location: { building: '1 qavatli bino', floor: 1, room: '15' },
   },
   {
      service_code: 'LAB.41.0871',
      name: "Lobarant ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 50000,
      price_foreign: 62000,
      location: { building: '1 qavatli bino', floor: 1, room: '13' },
   },
   {
      service_code: 'LAB.41.0871',
      name: "BAK lobarant ko'rigi",
      department_id: '69ef2768535b2ad865bda392',
      price_local: 50000,
      price_foreign: 62000,
      location: { building: '1 qavatli bino', floor: 1, room: '13' },
   },
]
export class SpecializationController {
   public static create = asyncHandler(async (req, res) => {
      const {
         service_code,
         name,
         department_id,
         price_local,
         price_foreign,
         location,
         is_active,
      } = req.body as SpecializationDocumentI

      // Check if department exists
      const department = await DepartmentModel.findById(department_id)
         .lean()
         .exec()
      if (!department) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Bo\\'lim topilmadi!",
         )
      }

      // Check if service code already exists if provided
      // if (service_code) {
      //    const existing = await SpecializationModel.findOne({
      //       service_code,
      //    }).lean()

      //    if (existing) {
      //       throw new HttpException(
      //          StatusCodes.BAD_REQUEST,
      //          ReasonPhrases.BAD_REQUEST,
      //          "Ushbu xizmat kodiga ega yo\\'nalish allaqachon mavjud!",
      //       )
      //    }
      // }

      await SpecializationModel.create({
         service_code,
         name,
         department_id,
         price_local,
         price_foreign,
         location,
         is_active,
      })

      res.status(StatusCodes.CREATED).json({
         success: true,
         message: "Yo\\'nalish muvaffaqiyatli yaratildi",
      })
   })

   public static getAll = asyncHandler(async (req, res) => {
      const page = parseInt(req.query.page as string, 10) || 1
      const limit = parseInt(req.query.limit as string, 10) || 20
      const search = (req.query.search as string) || ''
      const is_active = req.query.is_active
      const department_id = req.query.department_id as string

      const queryObj: any = {}

      if (search) {
         const escaped = regexEscape(search)
         queryObj.$or = [
            { name: { $regex: escaped, $options: 'i' } },
            { service_code: { $regex: escaped, $options: 'i' } },
         ]
      }

      if (is_active !== undefined) {
         queryObj.is_active = is_active === 'true'
      }

      if (department_id) {
         queryObj.department_id = department_id
      }

      const [result, total] = await Promise.all([
         SpecializationModel.find(queryObj)
            .populate('department_id', 'name')
            .sort({ created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .exec(),
         SpecializationModel.countDocuments(queryObj).exec(),
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

   public static seedData = asyncHandler(async (req, res) => {
      const batchSize = 5
      let totalCreated = 0

      // Batch inserts to avoid timeout with delay between batches
      for (let i = 0; i < data_big.length; i += batchSize) {
         const batch = data_big.slice(i, i + batchSize)

         try {
            const results = await Promise.all(
               batch.map(item => SpecializationModel.create(item)),
            )
            totalCreated += results.length
         } catch (error) {
            console.error(`Batch ${i / batchSize} failed:`, error)
         }

         // Small delay between batches to avoid overwhelming connection pool
         if (i + batchSize < data_big.length) {
            await new Promise(resolve => setTimeout(resolve, 100))
         }
      }

      res.status(StatusCodes.CREATED).json({
         success: true,
         message: `${totalCreated} ta yo'nalish muvaffaqiyatli qo'shildi`,
         count: totalCreated,
      })
   })

   public static getById = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const specialization = await SpecializationModel.findById(id)
         .populate('department_id', 'name')
         .lean()
         .exec()

      if (!specialization) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Yo\\'nalish topilmadi",
         )
      }

      res.status(StatusCodes.OK).json({ success: true, data: specialization })
   })

   public static update = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const {
         service_code,
         name,
         department_id,
         price_local,
         price_foreign,
         location,
         is_active,
      } = req.body as Partial<SpecializationDocumentI>

      const specialization = await SpecializationModel.findById(id).exec()

      if (!specialization) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Yo\\'nalish topilmadi",
         )
      }

      if (
         department_id &&
         department_id.toString() !== specialization.department_id.toString()
      ) {
         const department = await DepartmentModel.findById(department_id)
            .lean()
            .exec()
         if (!department) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               "Bo\\'lim topilmadi!",
            )
         }
      }

      if (service_code && service_code !== specialization.service_code) {
         const existing = await SpecializationModel.findOne({
            service_code,
         }).lean()
         if (existing) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               "Ushbu xizmat kodiga ega yo\\'nalish allaqachon mavjud!",
            )
         }
      }

      Object.assign(specialization, {
         ...(service_code !== undefined && { service_code }),
         ...(name !== undefined && { name }),
         ...(department_id !== undefined && { department_id }),
         ...(price_local !== undefined && { price_local }),
         ...(price_foreign !== undefined && { price_foreign }),
         ...(location !== undefined && { location }),
         ...(is_active !== undefined && { is_active }),
      })

      await specialization.save()

      res.status(StatusCodes.OK).json({
         success: true,
         message: "Yo\\'nalish muvaffaqiyatli yangilandi",
      })
   })

   public static delete = asyncHandler(async (req, res) => {
      const { id } = req.params as any

      const specialization = await SpecializationModel.findById(id).exec()

      if (!specialization) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Yo\\'nalish topilmadi",
         )
      }

      specialization.is_active = false
      await specialization.save()

      res.status(StatusCodes.OK).json({
         success: true,
         message: "Yo\\'nalish muvaffaqiyatli o\\'chirildi",
      })
   })

   public static activate = asyncHandler(async (req, res) => {
      const { id } = req.params as any

      const specialization = await SpecializationModel.findById(id).exec()

      if (!specialization) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Yo\\'nalish topilmadi",
         )
      }

      specialization.is_active = true
      await specialization.save()

      res.status(StatusCodes.OK).json({
         success: true,
         message: "Yo\\'nalish muvaffaqiyatli faollashtirildi",
      })
   })
}

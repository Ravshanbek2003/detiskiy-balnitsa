import { Router } from 'express'

import { RoleConstants } from '../../constants'
import { SalaryLogNurseController } from '../../controllers'
import { authMiddleware, roleMiddleware } from '../../utils'
import { SalaryLogNurseValidator, validate } from '../../validators'

export const salaryLogNurseRouter = Router()

// Faqat ACCOUNTANT uchun ruxsat
salaryLogNurseRouter.get(
   '/get-all',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   SalaryLogNurseValidator.getAll(),
   validate,
   SalaryLogNurseController.getAll,
)

salaryLogNurseRouter.get(
   '/get-one/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   SalaryLogNurseValidator.mongoId(),
   validate,
   SalaryLogNurseController.getById,
)

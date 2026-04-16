import { Router } from 'express'

import { RoleConstants } from '../../constants'
import { SalaryLogController } from '../../controllers'
import { authMiddleware, roleMiddleware } from '../../utils'
import { SalaryLogValidator, validate } from '../../validators'

const salaryLogRouter = Router()

salaryLogRouter.get(
   '/get-all',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   SalaryLogValidator.getAll(),
   validate,
   SalaryLogController.getAll,
)

salaryLogRouter.get(
   '/get-one/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   SalaryLogValidator.mongoId(),
   validate,
   SalaryLogController.getById,
)

export { salaryLogRouter }

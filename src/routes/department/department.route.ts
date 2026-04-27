import { Router } from 'express'

import { RoleConstants, getEndpointRoles } from '../../constants'
import { DepartmentController } from '../../controllers'
import { authMiddleware, roleMiddleware } from '../../utils'
import { DepartmentValidator, validate } from '../../validators'

export const departmentRouter = Router()

departmentRouter.post(
   '/create',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   DepartmentValidator.create(),
   validate,
   DepartmentController.create,
)

departmentRouter.put(
   '/update/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   DepartmentValidator.update(),
   validate,
   DepartmentController.update,
)

departmentRouter.patch(
   '/change-type/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   DepartmentValidator.changeType(),
   validate,
   DepartmentController.changeType,
)

departmentRouter.get(
   '/get-primary',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT, RoleConstants.CASHIER]),
   DepartmentController.getPrimary,
)

departmentRouter.get(
   '/get-all',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT, RoleConstants.CASHIER]),
   DepartmentValidator.getAll(),
   validate,
   DepartmentController.getAll,
)

departmentRouter.get(
   '/get-one/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT, RoleConstants.CASHIER]),
   DepartmentValidator.mongoId(),
   validate,
   DepartmentController.getById,
)

departmentRouter.delete(
   '/delete/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   DepartmentValidator.mongoId(),
   validate,
   DepartmentController.delete,
)

departmentRouter.patch(
   '/activate/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   DepartmentValidator.mongoId(),
   validate,
   DepartmentController.activate,
)

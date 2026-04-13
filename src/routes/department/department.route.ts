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

departmentRouter.get(
   '/get-all',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   DepartmentValidator.getAll(),
   validate,
   DepartmentController.getAll,
)

departmentRouter.get(
   '/get-one/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
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

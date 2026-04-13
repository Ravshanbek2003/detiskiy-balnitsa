import { Router } from 'express'

import { RoleConstants } from '../../constants'
import { SpecializationController } from '../../controllers'
import { authMiddleware, roleMiddleware } from '../../utils'
import { SpecializationValidator, validate } from '../../validators'

export const specializationRouter = Router()

specializationRouter.post(
   '/create',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   SpecializationValidator.create(),
   validate,
   SpecializationController.create,
)

specializationRouter.put(
   '/update/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   SpecializationValidator.update(),
   validate,
   SpecializationController.update,
)

specializationRouter.get(
   '/get-all',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   SpecializationValidator.getAll(),
   validate,
   SpecializationController.getAll,
)

specializationRouter.get(
   '/get-one/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   SpecializationValidator.mongoId(),
   validate,
   SpecializationController.getById,
)

specializationRouter.delete(
   '/delete/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   SpecializationValidator.mongoId(),
   validate,
   SpecializationController.delete,
)

specializationRouter.patch(
   '/activate/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   SpecializationValidator.mongoId(),
   validate,
   SpecializationController.activate,
)

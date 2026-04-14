import { Router } from 'express'

import { RoleConstants } from '../../constants'
import { UserController } from '../../controllers'
import { authMiddleware, roleMiddleware } from '../../utils'
import { UserValidator, validate } from '../../validators'

const userRouter = Router()

userRouter.post(
   '/create',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   UserValidator.create(),
   validate,
   UserController.create,
)
userRouter.put(
   '/update/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   UserValidator.update(),
   validate,
   UserController.update,
)
userRouter.get(
   '/get-all',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   UserValidator.getAll(),
   validate,
   UserController.getAll,
)
userRouter.get(
   '/get-one/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   UserValidator.mongoId(),
   validate,
   UserController.getById,
)
userRouter.patch(
   '/block/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   UserValidator.mongoId(),
   validate,
   UserController.toggleBlock,
)
userRouter.delete(
   '/delete/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   UserValidator.mongoId(),
   validate,
   UserController.delete,
)

export { userRouter }

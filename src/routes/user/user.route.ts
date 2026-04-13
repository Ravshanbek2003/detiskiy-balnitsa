import { Router } from 'express'

import { RoleConstants, getEndpointRoles } from '../../constants'
import { UserController } from '../../controllers'
import { authMiddleware, roleMiddleware } from '../../utils'
import { UserValidator, validate } from '../../validators'

const userRouter = Router()

// Apply cache middleware to all routes in this router

userRouter.post(
   '/create',
   authMiddleware,
   roleMiddleware([RoleConstants.ADMIN]),
   UserValidator.create(),
   validate,
   UserController.create,
)
userRouter.put(
   '/update/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ADMIN]),
   UserValidator.update(),
   validate,
   UserController.update,
)
userRouter.get(
   '/get-all',
   authMiddleware,
   roleMiddleware([RoleConstants.ADMIN]),
   UserValidator.getAll(),
   validate,
   UserController.getAll,
)
userRouter.get(
   '/get-one/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ADMIN]),
   UserValidator.mongoId(),
   validate,
   UserController.getById,
)
userRouter.patch(
   '/block/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ADMIN]),
   UserValidator.mongoId(),
   validate,
   UserController.toggleBlock,
)
userRouter.delete(
   '/delete/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ADMIN]),
   UserValidator.mongoId(),
   validate,
   UserController.delete,
)
userRouter.patch(
   '/update-last-login',
   authMiddleware,
   UserController.updateLastLogin,
)

export { userRouter }

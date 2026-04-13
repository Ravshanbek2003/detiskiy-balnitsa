import { Router } from 'express'

import { RoleConstants } from '../../constants'
import { AuthController } from '../../controllers'
import { authMiddleware, roleMiddleware } from '../../utils'
import { AuthValidator, validate } from '../../validators'

const authRouter = Router()

authRouter.post('/login', AuthValidator.login(), validate, AuthController.login)

authRouter.post(
   '/sign-up/admin',
   AuthValidator.signUpAdmin(),
   validate,
   AuthController.signUpAdmin,
)

authRouter.get(
   '/me',
   authMiddleware,
   roleMiddleware([RoleConstants.ADMIN, RoleConstants.MANAGER]),
   AuthController.getMe,
)

authRouter.patch(
   '/update-me',
   authMiddleware,
   roleMiddleware([RoleConstants.ADMIN, RoleConstants.MANAGER]),
   AuthValidator.updateMe(),
   validate,
   AuthController.updateMe,
)

authRouter.patch(
   '/update-password',
   authMiddleware,
   roleMiddleware([RoleConstants.ADMIN, RoleConstants.MANAGER]),
   AuthValidator.updatePassword(),
   validate,
   AuthController.updatePassword,
)

export { authRouter }

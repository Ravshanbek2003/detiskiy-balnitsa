import { Router } from 'express'

import { RoleConstants } from '../../constants'
import { AuthController } from '../../controllers'
import { authMiddleware, roleMiddleware } from '../../utils'
import { AuthValidator, validate } from '../../validators'

const authRouter = Router()

authRouter.post('/login', AuthValidator.login(), validate, AuthController.login)

authRouter.post(
   '/sign-up/accountant',
   AuthValidator.signUpAccountant(),
   validate,
   AuthController.signUpAccountant,
)

authRouter.get(
   '/me',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT, RoleConstants.CASHIER]),
   AuthController.getMe,
)

authRouter.patch(
   '/update-me',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT, RoleConstants.CASHIER]),
   AuthValidator.updateMe(),
   validate,
   AuthController.updateMe,
)

authRouter.patch(
   '/update-password',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT, RoleConstants.CASHIER]),
   AuthValidator.updatePassword(),
   validate,
   AuthController.updatePassword,
)

export { authRouter }

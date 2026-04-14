import { Router } from 'express'

import { RoleConstants } from '../../constants'
import { MainController } from '../../controllers/main/main.controller'
import { authMiddleware, roleMiddleware } from '../../utils'
import { validate } from '../../validators'
import { MainValidator } from '../../validators/main/main.validator'

const mainRouter = Router()

mainRouter.get(
   '/dashboard',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   MainValidator.getTodayDashboard(),
   validate,
   MainController.getTodayDashboard,
)

mainRouter.get(
   '/revenue-summary',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   MainValidator.dateRange(),
   validate,
   MainController.getRevenueSummary,
)

mainRouter.get(
   '/doctors-report',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   MainValidator.dateRange(),
   validate,
   MainController.getDoctorsReport,
)

mainRouter.get(
   '/specializations-report',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   MainValidator.dateRange(),
   validate,
   MainController.getSpecializationsReport,
)

mainRouter.get(
   '/workers-report',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   MainValidator.dateRange(),
   validate,
   MainController.getWorkersReport,
)

export { mainRouter }

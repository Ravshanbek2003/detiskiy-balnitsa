import { Router } from 'express'

import { RoleConstants } from '../../constants'
import { PatientController } from '../../controllers'
import { authMiddleware, roleMiddleware } from '../../utils'
import { PatientValidator, validate } from '../../validators'

export const patientRouter = Router()

patientRouter.post(
   '/create',
   authMiddleware,
   roleMiddleware([RoleConstants.CASHIER, RoleConstants.ACCOUNTANT]),
   PatientValidator.create(),
   validate,
   PatientController.create,
)

patientRouter.put(
   '/update/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.CASHIER, RoleConstants.ACCOUNTANT]),
   PatientValidator.update(),
   validate,
   PatientController.update,
)

patientRouter.get(
   '/get-all',
   authMiddleware,
   roleMiddleware([RoleConstants.CASHIER, RoleConstants.ACCOUNTANT]),
   PatientValidator.getAll(),
   validate,
   PatientController.getAll,
)

patientRouter.get(
   '/get-one/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.CASHIER, RoleConstants.ACCOUNTANT]),
   PatientValidator.mongoId(),
   validate,
   PatientController.getById,
)

patientRouter.delete(
   '/delete/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.CASHIER, RoleConstants.ACCOUNTANT]),
   PatientValidator.mongoId(),
   validate,
   PatientController.delete,
)

patientRouter.patch(
   '/update-payment-status/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.CASHIER, RoleConstants.ACCOUNTANT]),
   PatientValidator.updatePaymentStatus(),
   validate,
   PatientController.updatePaymentStatus,
)
 
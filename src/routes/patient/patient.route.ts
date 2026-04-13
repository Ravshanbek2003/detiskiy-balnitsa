import { Router } from 'express'

import { RoleConstants } from '../../constants'
import { PatientController } from '../../controllers'
import { authMiddleware, roleMiddleware } from '../../utils'
import { PatientValidator, validate } from '../../validators'

export const patientRouter = Router()

patientRouter.post(
   '/create',
   authMiddleware,
   roleMiddleware([RoleConstants.CASHIER]),
   PatientValidator.create(),
   validate,
   PatientController.create,
)

patientRouter.put(
   '/update/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.CASHIER]),
   PatientValidator.update(),
   validate,
   PatientController.update,
)

patientRouter.get(
   '/get-all',
   authMiddleware,
   roleMiddleware([RoleConstants.CASHIER]),
   PatientValidator.getAll(),
   validate,
   PatientController.getAll,
)

patientRouter.get(
   '/get-one/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.CASHIER]),
   PatientValidator.mongoId(),
   validate,
   PatientController.getById,
)

patientRouter.delete(
   '/delete/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.CASHIER]),
   PatientValidator.mongoId(),
   validate,
   PatientController.delete,
)

patientRouter.patch(
   '/update-payment-status/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.CASHIER]),
   PatientValidator.updatePaymentStatus(),
   validate,
   PatientController.updatePaymentStatus,
)

// bu yerda payment_statusni o'zgartirish uchun rote qo'shib ber

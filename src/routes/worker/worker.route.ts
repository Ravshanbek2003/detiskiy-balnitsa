import { Router } from 'express'

import { RoleConstants } from '../../constants'
import { WorkerController } from '../../controllers'
import { authMiddleware, roleMiddleware } from '../../utils'
import { WorkerValidator, validate } from '../../validators'

const workerRouter = Router()

workerRouter.post(
   '/create',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   WorkerValidator.create(),
   validate,
   WorkerController.create,
)

workerRouter.get(
   '/get-all',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   WorkerValidator.getAll(),
   validate,
   WorkerController.getAll,
)

workerRouter.get(
   '/get-one/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   WorkerValidator.mongoId(),
   validate,
   WorkerController.getById,
)

workerRouter.put(
   '/update/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   WorkerValidator.update(),
   validate,
   WorkerController.update,
)

workerRouter.delete(
   '/delete/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   WorkerValidator.mongoId(),
   validate,
   WorkerController.delete,
)

workerRouter.patch(
   '/status/:id',
   authMiddleware,
   roleMiddleware([RoleConstants.ACCOUNTANT]),
   WorkerValidator.mongoId(),
   validate,
   WorkerController.toggleStatus,
)

export { workerRouter }

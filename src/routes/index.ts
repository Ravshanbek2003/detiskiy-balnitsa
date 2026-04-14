import { authRouter } from './auth/auth.route'
import { departmentRouter } from './department/department.route'
import { patientRouter } from './patient/patient.route'
import { specializationRouter } from './specialization/specialization.route'
import { uploadRouter } from './upload/upload.route'
import { userRouter } from './user/user.route'
import { workerRouter } from './worker/worker.route'
import { mainRouter } from './main/main.route'

export const Routes = [
   { path: '/auth', router: authRouter },
   { path: '/department', router: departmentRouter },
   { path: '/patient', router: patientRouter },
   { path: '/specialization', router: specializationRouter },
   { path: '/upload', router: uploadRouter },
   { path: '/user', router: userRouter },
   { path: '/worker', router: workerRouter },
   { path: '/main', router: mainRouter },
]

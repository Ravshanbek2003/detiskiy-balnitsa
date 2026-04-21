import { authRouter } from './auth/auth.route'
import { departmentRouter } from './department/department.route'
import { mainRouter } from './main/main.route'
import { patientRouter } from './patient/patient.route'
import { salaryLogNurseRouter } from './salary-log-nurse/salary-log-nurse.route'
import { salaryLogRouter } from './salary-log/salary-log.route'
import { specializationRouter } from './specialization/specialization.route'
import { uploadRouter } from './upload/upload.route'
import { userRouter } from './user/user.route'
import { workerRouter } from './worker/worker.route'

export const Routes = [
   { path: '/auth', router: authRouter },
   { path: '/department', router: departmentRouter },
   { path: '/patient', router: patientRouter },
   { path: '/salary-log', router: salaryLogRouter },
   { path: '/salary-log-nurse', router: salaryLogNurseRouter },
   { path: '/specialization', router: specializationRouter },
   { path: '/upload', router: uploadRouter },
   { path: '/user', router: userRouter },
   { path: '/worker', router: workerRouter },
   { path: '/main', router: mainRouter },
]

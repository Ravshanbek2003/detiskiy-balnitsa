import { AuthSwagger } from './auth'
import { DepartmentSwagger } from './department'
import { Swagger, addSwaggerEndpoint } from './main'
import { PatientSwagger } from './patient'
import { SpecializationSwagger } from './specialization'
import { UploadSwagger } from './upload'
import { UserSwagger } from './user'
import { WorkerSwagger } from './worker'

addSwaggerEndpoint(Swagger, UploadSwagger)
addSwaggerEndpoint(Swagger, AuthSwagger)
addSwaggerEndpoint(Swagger, UserSwagger)
addSwaggerEndpoint(Swagger, DepartmentSwagger)
addSwaggerEndpoint(Swagger, SpecializationSwagger)
addSwaggerEndpoint(Swagger, PatientSwagger)
addSwaggerEndpoint(Swagger, WorkerSwagger)

export { Swagger }

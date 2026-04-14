import { SwaggerEndpointType, SwaggerType } from '../types'

const Swagger: SwaggerType = {
   openapi: '3.0.0',
   info: {
      title: 'Jorabayeva Balnitsa Backend API',
      description: 'Backend API documentation',
      version: '1.0.0',
      contact: {
         name: 'API Support',
      },
   },
   servers: [
      {
         url: 'http://localhost:8077',
         description: 'Current server',
      },
   ],
   components: {
      schemas: {},
      securitySchemes: {
         bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
         },
      },
   },
   security: [],
   paths: {},
}

const normalizePath = (value: string): string => value.replace(/^\/+|\/+$/g, '')

const addSwaggerEndpoint = (
   swagger: SwaggerType,
   endpoint: SwaggerEndpointType,
): void => {
   const endpointPath = normalizePath(endpoint.endpoint)

   endpoint.paths.forEach(item => {
      const routePath = normalizePath(item.path)
      swagger.paths[`/${endpointPath}/${routePath}`] = item.body
   })
}

export { Swagger, addSwaggerEndpoint }

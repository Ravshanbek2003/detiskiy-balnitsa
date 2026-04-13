export interface SwaggerType {
   openapi: string
   info: {
      title: string
      description: string
      version: string
      contact: {
         name: string
      }
   }
   servers: Array<{
      url: string
      description: string
   }>
   components: {
      schemas: Record<string, any>
      securitySchemes: {
         bearerAuth: {
            type: string
            scheme: string
            bearerFormat: string
         }
      }
   }
   security: Array<Record<string, any>>
   paths: Record<string, any>
}

export interface SwaggerEndpointType {
   endpoint: string
   paths: Array<{
      path: string
      body: any
   }>
}

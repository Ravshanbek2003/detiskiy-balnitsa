const AuthSwagger = {
   endpoint: 'auth',
   paths: [
      {
         path: 'login',
         body: {
            post: {
               tags: ['Auth'],
               summary: 'Login with login and password',
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              login: {
                                 type: 'string',
                                 example: '+998901234567',
                                 description:
                                    "Hozircha login sifatida telefon raqami ishlatiladi",
                              },
                              password: {
                                 type: 'string',
                                 example: 'password',
                              },
                           },
                           required: ['login', 'password'],
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: 'Login successful and access token returned',
                  },
                  '400': {
                     description: 'Invalid credentials',
                  },
               },
            },
         },
      },
      {
         path: 'sign-up/admin',
         body: {
            post: {
               tags: ['Auth'],
               summary: 'Create first admin user',
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              fullname: {
                                 type: 'string',
                                 example: 'Sardor Aliyev',
                              },
                              phone: {
                                 type: 'string',
                                 example: '+998901234567',
                              },
                              password: {
                                 type: 'string',
                                 example: 'password',
                              },
                              reg_key: {
                                 type: 'string',
                                 example: 'registrationkey789',
                              },
                           },
                           required: ['fullname', 'phone', 'password', 'reg_key'],
                        },
                     },
                  },
               },
               responses: {
                  '201': {
                     description: 'Admin created successfully',
                  },
                  '400': {
                     description: 'Invalid data or admin already exists',
                  },
               },
            },
         },
      },
      {
         path: 'me',
         body: {
            get: {
               tags: ['Auth'],
               summary: 'Get current user',
               security: [{ bearerAuth: [] }],
               responses: {
                  '200': {
                     description: 'Current user data',
                  },
                  '401': {
                     description: 'Authentication required',
                  },
               },
            },
         },
      },
      {
         path: 'update-me',
         body: {
            patch: {
               tags: ['Auth'],
               summary: 'Update current user profile',
               security: [{ bearerAuth: [] }],
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              fullname: { type: 'string' },
                              phone: {
                                 type: 'string',
                                 example: '+998901234567',
                              },
                              image: {
                                 type: 'string',
                                 example: 'https://example.com/photo.jpg',
                              },
                           },
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: 'Profile updated successfully',
                  },
               },
            },
         },
      },
      {
         path: 'update-password',
         body: {
            patch: {
               tags: ['Auth'],
               summary: 'Update current user password',
               security: [{ bearerAuth: [] }],
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              new_password: {
                                 type: 'string',
                                 example: 'newPass123',
                              },
                           },
                           required: ['new_password'],
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: 'Password updated successfully',
                  },
               },
            },
         },
      },
   ],
}

export { AuthSwagger }

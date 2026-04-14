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
                                 example: 'accountant_login',
                                 description:
                                    "Foydalanuvchi logini",
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
         path: 'sign-up/accountant',
         body: {
            post: {
               tags: ['Auth'],
               summary: 'Create first accountant user',
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
                              login: {
                                 type: 'string',
                                 example: 'accountant_01',
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
                           required: ['fullname', 'login', 'password', 'reg_key'],
                        },
                     },
                  },
               },
               responses: {
                  '201': {
                     description: 'Accountant created successfully',
                  },
                  '400': {
                     description: 'Invalid data or login already exists',
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
                              login: { type: 'string', example: 'new_login' },
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

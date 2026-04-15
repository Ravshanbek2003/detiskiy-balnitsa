import { SwaggerExamples } from './examples'

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
                                 example: 'sardor_01',
                                 description: 'Foydalanuvchi logini',
                              },
                              password: {
                                 type: 'string',
                                 example: 'password123',
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
                     content: {
                        'application/json': {
                           schema: { type: 'object' },
                           example: SwaggerExamples.auth.login_success,
                        },
                     },
                  },
                  '400': {
                     description: 'Invalid credentials',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.auth.login_error,
                        },
                     },
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
                                 example: 'sardor_01',
                              },
                              phone: {
                                 type: 'string',
                                 example: '+998901234567',
                              },
                              password: {
                                 type: 'string',
                                 example: 'SecurePass123',
                              },
                              reg_key: {
                                 type: 'string',
                                 example: 'registrationkey789',
                              },
                           },
                           required: [
                              'fullname',
                              'login',
                              'password',
                              'reg_key',
                           ],
                        },
                     },
                  },
               },
               responses: {
                  '201': {
                     description: 'Accountant created successfully',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.auth.signup_success,
                        },
                     },
                  },
                  '400': {
                     description: 'Invalid data or login already exists',
                     content: {
                        'application/json': {
                           example: {
                              success: false,
                              error: {
                                 statusCode: 400,
                                 statusMsg: 'BAD_REQUEST',
                                 msg: 'Bu login allaqachon mavjud',
                              },
                           },
                        },
                     },
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
                     content: {
                        'application/json': {
                           example: SwaggerExamples.auth.get_me,
                        },
                     },
                  },
                  '401': {
                     description: 'Authentication required',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.errors.unauthorized,
                        },
                     },
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
                              fullname: {
                                 type: 'string',
                                 example: 'Sardor Aliyev Jr.',
                              },
                              login: {
                                 type: 'string',
                                 example: 'sardor_new_login',
                              },
                              phone: {
                                 type: 'string',
                                 example: '+998901234567',
                              },
                              image: {
                                 type: 'string',
                                 example:
                                    'https://s3.example.com/users/photo.jpg',
                              },
                           },
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: 'Profile updated successfully',
                     content: {
                        'application/json': {
                           example: {
                              success: true,
                              message: 'Profil muvaffaqiyatli yangilandi',
                           },
                        },
                     },
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

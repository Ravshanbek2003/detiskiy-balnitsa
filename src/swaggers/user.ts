const UserSwagger = {
   endpoint: 'user',
   paths: [
      {
         path: 'create',
         body: {
            post: {
               tags: ['User'],
               summary:
                  'Yangi foydalanuvchi (manager) yaratish — Ruxsat: ADMIN',
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              fullname: {
                                 type: 'string',
                                 example: 'Jasur Karimov',
                              },
                              phone: {
                                 type: 'string',
                                 example: '+998901234567',
                              },
                              password: { type: 'string', example: 'P@ssw0rd' },
                              role: {
                                 type: 'string',
                                 example: 'MANAGER',
                                 enum: ['ADMIN', 'MANAGER'],
                              },
                           },
                           required: ['fullname', 'phone', 'password', 'role'],
                        },
                     },
                  },
               },
               responses: {
                  '201': {
                     description: 'Foydalanuvchi muvaffaqiyatli yaratildi',
                  },
                  '400': {
                     description:
                        'Validatsiya xatoligi yoki telefon raqam band',
                  },
               },
            },
         },
      },
      {
         path: 'get-all',
         body: {
            get: {
               tags: ['User'],
               summary: "Foydalanuvchilar ro'yxatini olish — Ruxsat: ADMIN",
               parameters: [
                  {
                     name: 'page',
                     in: 'query',
                     schema: { type: 'integer', example: 1 },
                  },
                  {
                     name: 'limit',
                     in: 'query',
                     schema: { type: 'integer', example: 20 },
                  },
                  {
                     name: 'search',
                     in: 'query',
                     schema: { type: 'string', example: 'Jasur' },
                  },
                  {
                     name: 'role',
                     in: 'query',
                     schema: {
                        type: 'string',
                        example: 'MANAGER',
                        enum: ['ADMIN', 'MANAGER'],
                     },
                  },
                  {
                     name: 'status',
                     in: 'query',
                     schema: {
                        type: 'string',
                        example: 'active',
                        enum: ['active', 'blocked', 'deleted'],
                     },
                  },
                  {
                     name: 'startDate',
                     in: 'query',
                     required: false,
                     schema: {
                        type: 'string',
                        format: 'date',
                        example: '2026-01-01',
                     },
                     description: 'Boshlanish sanasi (YYYY-MM-DD)',
                  },
                  {
                     name: 'endDate',
                     in: 'query',
                     required: false,
                     schema: {
                        type: 'string',
                        format: 'date',
                        example: '2026-12-31',
                     },
                     description: 'Tugash sanasi (YYYY-MM-DD)',
                  },
               ],
               responses: {
                  '200': {
                     description: "Foydalanuvchilar ro'yxati",
                     content: {
                        'application/json': {
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 data: {
                                    type: 'array',
                                    items: {
                                       type: 'object',
                                       properties: {
                                          _id: { type: 'string' },
                                          fullname: { type: 'string' },
                                          phone: { type: 'string' },
                                          role: { type: 'string' },
                                          status: { type: 'string' },
                                          last_login: {
                                             type: 'string',
                                             format: 'date-time',
                                          },
                                          created_at: {
                                             type: 'string',
                                             format: 'date-time',
                                          },
                                       },
                                    },
                                 },
                                 pagination: {
                                    type: 'object',
                                    properties: {
                                       page: { type: 'integer' },
                                       limit: { type: 'integer' },
                                       total_items: { type: 'integer' },
                                       total_pages: { type: 'integer' },
                                       next_page: {
                                          type: ['integer', 'null'],
                                       },
                                       prev_page: {
                                          type: ['integer', 'null'],
                                       },
                                    },
                                 },
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
         path: 'get-one/{id}',
         body: {
            get: {
               tags: ['User'],
               summary: "Foydalanuvchini ID bo'yicha olish — Ruxsat: ADMIN",
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: {
                        type: 'string',
                        example: '64b8f1a2c3d4e5f6a7b8c9d0',
                     },
                  },
               ],
               responses: {
                  '200': {
                     description: "Foydalanuvchi ma'lumotlari",
                     content: {
                        'application/json': {
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 data: {
                                    type: 'object',
                                    properties: {
                                       _id: { type: 'string' },
                                       fullname: { type: 'string' },
                                       phone: { type: 'string' },
                                       role: { type: 'string' },
                                       status: { type: 'string' },
                                       last_login: {
                                          type: 'string',
                                          format: 'date-time',
                                       },
                                       created_at: {
                                          type: 'string',
                                          format: 'date-time',
                                       },
                                    },
                                 },
                              },
                           },
                        },
                     },
                  },
                  '404': { description: 'Foydalanuvchi topilmadi' },
               },
            },
         },
      },
      {
         path: 'update/{id}',
         body: {
            put: {
               tags: ['User'],
               summary: 'Foydalanuvchini yangilash — Ruxsat: ADMIN',
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: {
                        type: 'string',
                        example: '64b8f1a2c3d4e5f6a7b8c9d0',
                     },
                  },
               ],
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
                              role: {
                                 type: 'string',
                                 enum: ['ADMIN', 'MANAGER'],
                              },
                              password: { type: 'string' },
                           },
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: 'Foydalanuvchi muvaffaqiyatli yangilandi',
                  },
                  '400': {
                     description:
                        'Validatsiya xatoligi yoki telefon raqam band',
                  },
                  '404': { description: 'Foydalanuvchi topilmadi' },
               },
            },
         },
      },
      {
         path: 'block/{id}',
         body: {
            patch: {
               tags: ['User'],
               summary:
                  'Foydalanuvchini bloklash/blokdan chiqarish — Ruxsat: ADMIN',
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: {
                        type: 'string',
                        example: '64b8f1a2c3d4e5f6a7b8c9d0',
                     },
                  },
               ],
               responses: {
                  '200': {
                     description:
                        'Foydalanuvchi bloklandi yoki blokdan chiqarildi',
                  },
                  '404': { description: 'Foydalanuvchi topilmadi' },
               },
            },
         },
      },
      {
         path: 'delete/{id}',
         body: {
            delete: {
               tags: ['User'],
               summary: "Foydalanuvchini o'chirish — Ruxsat: ADMIN",
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: {
                        type: 'string',
                        example: '64b8f1a2c3d4e5f6a7b8c9d0',
                     },
                  },
               ],
               responses: {
                  '200': {
                     description: "Foydalanuvchi muvaffaqiyatli o'chirildi",
                  },
                  '404': { description: 'Foydalanuvchi topilmadi' },
               },
            },
         },
      },
      {
         path: 'update-last-login',
         body: {
            patch: {
               tags: ['User'],
               summary:
                  "Foydalanuvchi (admin o'zi) platformaga kirganida oxirgi kirish vaqtini yangilash",
               security: [{ bearerAuth: [] }],
               responses: {
                  '200': {
                     description: 'Kirish vaqti muvaffaqiyatli yangilandi',
                     content: {
                        'application/json': {
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 message: {
                                    type: 'string',
                                    example: 'Oxirgi kirish vaqti yangilandi',
                                 },
                              },
                           },
                        },
                     },
                  },
                  '401': { description: "Avtorizatsiyadan o'tilmagan" },
               },
            },
         },
      },
   ],
}

export { UserSwagger }

const UserSwagger = {
   endpoint: 'user',
   paths: [
      {
         path: 'create',
         body: {
            post: {
               tags: ['User'],
               summary:
                  'Yangi foydalanuvchi yaratish — Ruxsat: ACCOUNTANT',
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
                                 example: 'Jasur Karimov',
                              },
                              login: {
                                 type: 'string',
                                 example: 'jasur_01',
                              },
                              phone: {
                                 type: 'string',
                                 example: '+998901234567',
                              },
                              password: { type: 'string', example: 'P@ssw0rd' },
                              role: {
                                 type: 'string',
                                 example: 'CASHIER',
                                 enum: ['ACCOUNTANT', 'CASHIER'],
                              },
                           },
                           required: ['fullname', 'login', 'password', 'role'],
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
                        'Validatsiya xatoligi yoki login/telefon raqam band',
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
               summary: "Foydalanuvchilar ro'yxatini olish — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
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
                        example: 'CASHIER',
                        enum: ['ACCOUNTANT', 'CASHIER'],
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
               summary: "Foydalanuvchini ID bo'yicha olish — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
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
                  },
               },
            },
         },
      },
      {
         path: 'update/{id}',
         body: {
            put: {
               tags: ['User'],
               summary: "Foydalanuvchini tahrirlash",
               security: [{ bearerAuth: [] }],
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: {
                        type: 'string',
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
                              login: { type: 'string' },
                              phone: { type: 'string' },
                              password: { type: 'string' },
                              role: {
                                 type: 'string',
                                 enum: ['ACCOUNTANT', 'CASHIER'],
                              },
                           },
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: "Foydalanuvchi ma'lumotlari yangilandi",
                  },
               },
            },
         },
      },
      {
         path: 'delete/{id}',
         body: {
            delete: {
               tags: ['User'],
               summary: "Foydalanuvchini o'chirish",
               security: [{ bearerAuth: [] }],
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: {
                        type: 'string',
                     },
                  },
               ],
               responses: {
                  '200': {
                     description: "Foydalanuvchi o'chirildi",
                  },
               },
            },
         },
      },
      {
         path: 'block/{id}',
         body: {
            patch: {
               tags: ['User'],
               summary: "Foydalanuvchini blocklash / blockdan chiqarish",
               security: [{ bearerAuth: [] }],
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: {
                        type: 'string',
                     },
                  },
               ],
               responses: {
                  '200': {
                     description: "Status o'zgardi",
                  },
               },
            },
         },
      },
   ],
}

export { UserSwagger }

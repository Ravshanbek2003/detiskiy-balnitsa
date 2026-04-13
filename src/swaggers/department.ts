export const DepartmentSwagger = {
   endpoint: 'department',
   paths: [
      {
         path: 'create',
         body: {
            post: {
               tags: ['Department'],
               summary: "Yangi bo'lim yaratish — Ruxsat: CASHIER",
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              name: {
                                 type: 'string',
                                 example: 'Kardiologiya',
                              },
                              share_percentages: {
                                 type: 'object',
                                 properties: {
                                    doctor: { type: 'number', example: 50 },
                                    nurse: { type: 'number', example: 30 },
                                    assistant_nurse: {
                                       type: 'number',
                                       example: 20,
                                    },
                                 },
                              },
                              description: {
                                 type: 'string',
                                 example: "Kardiologiya bo'limi haqida",
                              },
                              is_active: {
                                 type: 'boolean',
                                 example: true,
                              },
                           },
                           required: ['name'],
                        },
                     },
                  },
               },
               responses: {
                  '201': {
                     description: "Bo'lim muvaffaqiyatli yaratildi",
                  },
                  '400': {
                     description: 'Validatsiya xatoligi',
                  },
               },
            },
         },
      },
      {
         path: 'get-all',
         body: {
            get: {
               tags: ['Department'],
               summary: "Barcha bo'limlarni olish — Ruxsat: CASHIER",
               parameters: [
                  {
                     name: 'page',
                     in: 'query',
                     schema: { type: 'integer', default: 1 },
                  },
                  {
                     name: 'limit',
                     in: 'query',
                     schema: { type: 'integer', default: 20 },
                  },
                  {
                     name: 'search',
                     in: 'query',
                     schema: { type: 'string' },
                  },
                  {
                     name: 'is_active',
                     in: 'query',
                     schema: { type: 'boolean' },
                  },
               ],
               responses: {
                  '200': {
                     description: "Bo'limlar ro'yxati",
                  },
               },
            },
         },
      },
      {
         path: 'get-one/{id}',
         body: {
            get: {
               tags: ['Department'],
               summary: "Bitta bo'limni ko'rish — Ruxsat: CASHIER",
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: { type: 'string' },
                  },
               ],
               responses: {
                  '200': {
                     description: "Bo'lim topildi",
                  },
                  '404': {
                     description: "Bo'lim topilmadi",
                  },
               },
            },
         },
      },
      {
         path: 'update/{id}',
         body: {
            put: {
               tags: ['Department'],
               summary: "Bo'limni yangilash — Ruxsat: CASHIER",
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: { type: 'string' },
                  },
               ],
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              name: {
                                 type: 'string',
                                 example: 'Kardiologiya',
                              },
                              share_percentages: {
                                 type: 'object',
                                 properties: {
                                    doctor: { type: 'number', example: 50 },
                                    nurse: { type: 'number', example: 30 },
                                    assistant_nurse: {
                                       type: 'number',
                                       example: 20,
                                    },
                                 },
                              },
                              description: {
                                 type: 'string',
                                 example: "Kardiologiya bo'limi haqida",
                              },
                              is_active: {
                                 type: 'boolean',
                                 example: true,
                              },
                           },
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: "Bo'lim muvaffaqiyatli yangilandi",
                  },
                  '404': {
                     description: "Bo'lim topilmadi",
                  },
               },
            },
         },
      },
      {
         path: 'delete/{id}',
         body: {
            delete: {
               tags: ['Department'],
               summary: "Bo'limni o'chirish — Ruxsat: CASHIER",
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: { type: 'string' },
                  },
               ],
               responses: {
                  '200': {
                     description: "Bo'lim o'chirildi",
                  },
                  '404': {
                     description: "Bo'lim topilmadi",
                  },
               },
            },
         },
      },
      {
         path: 'activate/{id}',
         body: {
            patch: {
               tags: ['Department'],
               summary: "Bo'limni faollashtirish — Ruxsat: CASHIER",
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: { type: 'string' },
                  },
               ],
               responses: {
                  '200': {
                     description: "Bo'lim faollashtirildi",
                  },
                  '404': {
                     description: "Bo'lim topilmadi",
                  },
               },
            },
         },
      },
   ],
}

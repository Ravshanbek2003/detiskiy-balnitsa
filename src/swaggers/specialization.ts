export const SpecializationSwagger = {
   endpoint: 'specialization',
   paths: [
      {
         path: 'create',
         body: {
            post: {
               tags: ['Specialization'],
               summary: "Yangi yo'nalish yaratish — Ruxsat: CASHIER",
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              service_code: { type: 'string', example: 'A100' },
                              name: {
                                 type: 'string',
                                 example: 'Kardiologik tekshiruv',
                              },
                              department_id: {
                                 type: 'string',
                                 example: '601f191e810c19729de860ea',
                              },
                              price_local: { type: 'number', example: 50000 },
                              price_foreign: {
                                 type: 'number',
                                 example: 100000,
                              },
                              location: {
                                 type: 'object',
                                 properties: {
                                    building: {
                                       type: 'string',
                                       example: 'A bino',
                                    },
                                    floor: { type: 'number', example: 2 },
                                    room: {
                                       type: 'string',
                                       example: '201-xona',
                                    },
                                 },
                              },
                              is_active: {
                                 type: 'boolean',
                                 example: true,
                              },
                           },
                           required: [
                              'name',
                              'department_id',
                              'price_local',
                              'price_foreign',
                           ],
                        },
                     },
                  },
               },
               responses: {
                  '201': {
                     description: "Yo'nalish muvaffaqiyatli yaratildi",
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
               tags: ['Specialization'],
               summary: "Barcha yo'nalishlarni olish — Ruxsat: CASHIER",
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
                     name: 'department_id',
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
                     description: "Yo'nalishlar ro'yxati",
                  },
               },
            },
         },
      },
      {
         path: 'get-one/{id}',
         body: {
            get: {
               tags: ['Specialization'],
               summary: "Bitta yo'nalishni ko'rish — Ruxsat: CASHIER",
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
                     description: "Yo'nalish topildi",
                  },
                  '404': {
                     description: "Yo'nalish topilmadi",
                  },
               },
            },
         },
      },
      {
         path: 'update/{id}',
         body: {
            put: {
               tags: ['Specialization'],
               summary: "Yo'nalishni yangilash — Ruxsat: CASHIER",
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
                              service_code: { type: 'string', example: 'A100' },
                              name: {
                                 type: 'string',
                                 example: 'Kardiologik tekshiruv',
                              },
                              department_id: {
                                 type: 'string',
                                 example: '601f191e810c19729de860ea',
                              },
                              price_local: { type: 'number', example: 50000 },
                              price_foreign: {
                                 type: 'number',
                                 example: 100000,
                              },
                              location: {
                                 type: 'object',
                                 properties: {
                                    building: {
                                       type: 'string',
                                       example: 'A bino',
                                    },
                                    floor: { type: 'number', example: 2 },
                                    room: {
                                       type: 'string',
                                       example: '201-xona',
                                    },
                                 },
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
                     description: "Yo'nalish muvaffaqiyatli yangilandi",
                  },
                  '404': {
                     description: "Yo'nalish topilmadi",
                  },
               },
            },
         },
      },
      {
         path: 'delete/{id}',
         body: {
            delete: {
               tags: ['Specialization'],
               summary: "Yo'nalishni o'chirish — Ruxsat: CASHIER",
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
                     description: "Yo'nalish o'chirildi",
                  },
                  '404': {
                     description: "Yo'nalish topilmadi",
                  },
               },
            },
         },
      },
      {
         path: 'activate/{id}',
         body: {
            patch: {
               tags: ['Specialization'],
               summary: "Yo'nalishni faollashtirish — Ruxsat: CASHIER",
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
                     description: "Yo'nalish faollashtirildi",
                  },
                  '404': {
                     description: "Yo'nalish topilmadi",
                  },
               },
            },
         },
      },
   ],
}

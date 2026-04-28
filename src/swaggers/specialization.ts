import { SwaggerExamples } from './examples'

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
                     content: {
                        'application/json': {
                           example:
                              SwaggerExamples.specialization.create_success,
                        },
                     },
                  },
                  '400': {
                     description: 'Validatsiya xatoligi',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.errors.validation_error,
                        },
                     },
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
                     content: {
                        'application/json': {
                           example: SwaggerExamples.specialization.get_all,
                        },
                     },
                  },
               },
            },
         },
      },
      {
         path: 'seed-data',
         body: {
            post: {
               tags: ['Specialization'],
               summary:
                  "Ma'lumotlarni baza bo'lmasa to'ldiriladi — Ruxsat: ACCOUNTANT",
               description:
                  "47 ta yo'nalish ma'lumotini bazaga qo'shadi (seed data)",
               responses: {
                  '201': {
                     description: "Seed data muvaffaqiyatli qo'shildi",
                     content: {
                        'application/json': {
                           example: {
                              success: true,
                              message:
                                 "47 ta yo'nalish muvaffaqiyatli qo'shildi",
                              count: 47,
                           },
                        },
                     },
                  },
                  '401': {
                     description: 'Autentifikatsiya xatoligi',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.errors.unauthorized,
                        },
                     },
                  },
                  '403': {
                     description: 'Ruxsat berilmagan',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.errors.forbidden,
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
                     content: {
                        'application/json': {
                           example: SwaggerExamples.specialization.get_one,
                        },
                     },
                  },
                  '404': {
                     description: "Yo'nalish topilmadi",
                     content: {
                        'application/json': {
                           example: SwaggerExamples.errors.not_found,
                        },
                     },
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
                     content: {
                        'application/json': {
                           example: {
                              success: true,
                              message:
                                 "Yo'nalish ma'lumotlari muvaffaqiyatli yangilandi",
                           },
                        },
                     },
                  },
                  '400': {
                     description: 'Validatsiya xatoligi',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.errors.validation_error,
                        },
                     },
                  },
                  '404': {
                     description: "Yo'nalish topilmadi",
                     content: {
                        'application/json': {
                           example: SwaggerExamples.errors.not_found,
                        },
                     },
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
                     content: {
                        'application/json': {
                           example: {
                              success: true,
                              message: "Yo'nalish muvaffaqiyatli o'chirildi",
                           },
                        },
                     },
                  },
                  '404': {
                     description: "Yo'nalish topilmadi",
                     content: {
                        'application/json': {
                           example: SwaggerExamples.errors.not_found,
                        },
                     },
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
                     content: {
                        'application/json': {
                           example: {
                              success: true,
                              message:
                                 "Yo'nalish statusi muvaffaqiyatli o'zgardi",
                           },
                        },
                     },
                  },
                  '404': {
                     description: "Yo'nalish topilmadi",
                     content: {
                        'application/json': {
                           example: SwaggerExamples.errors.not_found,
                        },
                     },
                  },
               },
            },
         },
      },
   ],
}

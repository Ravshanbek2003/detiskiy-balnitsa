import { SwaggerExamples } from './examples'

export const WorkerSwagger = {
   endpoint: 'worker',
   paths: [
      {
         path: 'create',
         body: {
            post: {
               tags: ['Worker'],
               summary: 'Yangi xodim yaratish — Ruxsat: ACCOUNTANT',
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
                                 example: 'Alijon Aliyev',
                              },
                              phone: {
                                 type: 'string',
                                 example: '+998901234567',
                              },
                              image: { type: 'string' },
                              department_id: { type: 'string' },
                              specialization_id: { type: 'string' },
                              worker_type: {
                                 type: 'string',
                                 enum: ['doctor', 'nurse', 'assistant_nurse'],
                              },
                              notes: { type: 'string' },
                           },
                           required: [
                              'fullname',
                              'phone',
                              'department_id',
                              'specialization_id',
                              'worker_type',
                           ],
                        },
                     },
                  },
               },
               responses: {
                  '201': {
                     description: 'Xodim yaratildi',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.worker.create_success,
                        },
                     },
                  },
                  '400': {
                     description: 'Validatsiya xatosi',
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
               tags: ['Worker'],
               summary: "Xodimlar ro'yxatini olish — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
               parameters: [
                  { name: 'page', in: 'query', schema: { type: 'integer' } },
                  { name: 'limit', in: 'query', schema: { type: 'integer' } },
                  { name: 'search', in: 'query', schema: { type: 'string' } },
                  {
                     name: 'worker_type',
                     in: 'query',
                     schema: {
                        type: 'string',
                        enum: ['doctor', 'nurse', 'assistant_nurse'],
                     },
                  },
                  {
                     name: 'department_id',
                     in: 'query',
                     schema: { type: 'string' },
                  },
                  {
                     name: 'specialization_id',
                     in: 'query',
                     schema: { type: 'string' },
                  },
                  {
                     name: 'status',
                     in: 'query',
                     schema: {
                        type: 'string',
                        enum: ['active', 'inactive', 'deleted'],
                     },
                  },
               ],
               responses: {
                  '200': {
                     description: 'Xodimlar listi',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.worker.get_all,
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
               tags: ['Worker'],
               summary: "Xodim ma'lumotini olish — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
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
                     description: "Xodim ob'yekti",
                     content: {
                        'application/json': {
                           example: SwaggerExamples.worker.get_one,
                        },
                     },
                  },
                  '404': {
                     description: 'Xodim topilmadi',
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
               tags: ['Worker'],
               summary: 'Xodimni tahrirlash — Ruxsat: ACCOUNTANT',
               security: [{ bearerAuth: [] }],
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
                              fullname: { type: 'string' },
                              phone: { type: 'string' },
                              image: { type: 'string' },
                              department_id: { type: 'string' },
                              specialization_id: { type: 'string' },
                              worker_type: {
                                 type: 'string',
                                 enum: ['doctor', 'nurse', 'assistant_nurse'],
                              },
                              notes: { type: 'string' },
                           },
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: 'Yangilandi',
                     content: {
                        'application/json': {
                           example: {
                              success: true,
                              message:
                                 "Xodim ma'lumotlari muvaffaqiyatli yangilandi",
                           },
                        },
                     },
                  },
                  '400': {
                     description: 'Validatsiya xatosi',
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
         path: 'delete/{id}',
         body: {
            delete: {
               tags: ['Worker'],
               summary: "Xodimni o'chirish — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
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
                     description: "O'chirildi",
                     content: {
                        'application/json': {
                           example: {
                              success: true,
                              message: "Xodim muvaffaqiyatli o'chirildi",
                           },
                        },
                     },
                  },
                  '404': {
                     description: 'Xodim topilmadi',
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
         path: 'status/{id}',
         body: {
            patch: {
               tags: ['Worker'],
               summary:
                  'Xodim statusini o`zgartirish (active <-> inactive) — Ruxsat: ACCOUNTANT',
               security: [{ bearerAuth: [] }],
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
                     description: 'Status o`zgardi',
                     content: {
                        'application/json': {
                           example: {
                              success: true,
                              message: "Xodim statusi muvaffaqiyatli o'zgardi",
                           },
                        },
                     },
                  },
               },
            },
         },
      },
   ],
}

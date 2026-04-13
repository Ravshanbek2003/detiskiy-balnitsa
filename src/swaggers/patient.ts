export const PatientSwagger = {
   endpoint: 'patient',
   paths: [
      {
         path: 'create',
         body: {
            post: {
               tags: ['Patient'],
               summary: "Bemor ro'yxatdan o'tkazish — Ruxsat: CASHIER",
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              full_name: {
                                 type: 'string',
                                 example: 'Ali Valiyev',
                              },
                              check_number: {
                                 type: 'string',
                                 example: 'CHK-10293',
                              },
                              department_id: {
                                 type: 'string',
                                 example: '601f...',
                              },
                              department_name: {
                                 type: 'string',
                                 example: 'Kardiologiya',
                              },
                              specialization_id: {
                                 type: 'string',
                                 example: '601f...',
                              },
                              specialization_name: {
                                 type: 'string',
                                 example: 'EKO kardiologiya',
                              },
                              doctor: { type: 'string', example: '601f...' },
                              doctor_name: {
                                 type: 'string',
                                 example: 'Dr. Qodirov',
                              },
                              nurse: { type: 'string', example: '601f...' },
                              nurse_name: {
                                 type: 'string',
                                 example: 'Hamshira Guli',
                              },
                              amount: { type: 'number', example: 150000 },
                              payment_method: {
                                 type: 'string',
                                 enum: ['cash', 'card', 'click'],
                                 example: 'cash',
                              },
                              payment_status: {
                                 type: 'string',
                                 enum: ['paid', 'unpaid'],
                                 example: 'paid',
                              },
                           },
                           required: [
                              'full_name',
                              'check_number',
                              'amount',
                              'payment_method',
                           ],
                        },
                     },
                  },
               },
               responses: {
                  '201': {
                     description: "Bemor muvaffaqiyatli ro'yxatga olindi",
                  },
                  '400': {
                     description: 'Validatsiya xatosi yoki chek raqam mavjud',
                  },
               },
            },
         },
      },
      {
         path: 'get-all',
         body: {
            get: {
               tags: ['Patient'],
               summary: 'Barcha bemorlarni olish — Ruxsat: CASHIER',
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
                  { name: 'search', in: 'query', schema: { type: 'string' } },
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
                     name: 'payment_method',
                     in: 'query',
                     schema: {
                        type: 'string',
                        enum: ['cash', 'card', 'click'],
                     },
                  },
                  {
                     name: 'payment_status',
                     in: 'query',
                     schema: { type: 'string', enum: ['paid', 'unpaid'] },
                  },
               ],
               responses: {
                  '200': {
                     description: "Bemorlar ro'yxati",
                  },
               },
            },
         },
      },
      {
         path: 'get-one/{id}',
         body: {
            get: {
               tags: ['Patient'],
               summary: "Bitta bemorni ko'rish — Ruxsat: CASHIER",
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
                     description: 'Bemor topildi',
                  },
                  '404': {
                     description: 'Bemor topilmadi',
                  },
               },
            },
         },
      },
      {
         path: 'update/{id}',
         body: {
            put: {
               tags: ['Patient'],
               summary: "Bemor ma'lumotlarini yangilash — Ruxsat: CASHIER",
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
                              full_name: {
                                 type: 'string',
                                 example: 'Ali Valiyev',
                              },
                              check_number: {
                                 type: 'string',
                                 example: 'CHK-10293',
                              },
                              department_id: {
                                 type: 'string',
                                 example: '601f...',
                              },
                              department_name: {
                                 type: 'string',
                                 example: 'Kardiologiya',
                              },
                              specialization_id: {
                                 type: 'string',
                                 example: '601f...',
                              },
                              specialization_name: {
                                 type: 'string',
                                 example: 'EKO kardiologiya',
                              },
                              doctor: { type: 'string', example: '601f...' },
                              doctor_name: {
                                 type: 'string',
                                 example: 'Dr. Qodirov',
                              },
                              nurse: { type: 'string', example: '601f...' },
                              nurse_name: {
                                 type: 'string',
                                 example: 'Hamshira Guli',
                              },
                              amount: { type: 'number', example: 150000 },
                              payment_method: {
                                 type: 'string',
                                 enum: ['cash', 'card', 'click'],
                                 example: 'cash',
                              },
                              payment_status: {
                                 type: 'string',
                                 enum: ['paid', 'unpaid'],
                                 example: 'paid',
                              },
                           },
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: 'Bemor muvaffaqiyatli yangilandi',
                  },
                  '404': {
                     description: 'Bemor topilmadi',
                  },
               },
            },
         },
      },
      {
         path: 'delete/{id}',
         body: {
            delete: {
               tags: ['Patient'],
               summary: "Bemorni o'chirish — Ruxsat: CASHIER",
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
                     description: "Bemor o'chirildi",
                  },
                  '404': {
                     description: 'Bemor topilmadi',
                  },
               },
            },
         },
      },
      {
         path: 'update-payment-status/{id}',
         body: {
            patch: {
               tags: ['Patient'],
               summary: "To'lov holatini o'zgartirish — Ruxsat: CASHIER",
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
                              payment_status: {
                                 type: 'string',
                                 enum: ['paid', 'unpaid'],
                                 example: 'paid',
                              },
                           },
                           required: ['payment_status'],
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: "To'lov holati yangilandi",
                  },
                  '404': {
                     description: 'Bemor topilmadi',
                  },
               },
            },
         },
      },
   ],
}

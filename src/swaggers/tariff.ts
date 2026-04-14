export const TariffSwagger = {
   endpoint: 'tariff',
   paths: [
      {
         path: 'get-all',
         body: {
            get: {
               tags: ['Tariff'],
               summary: 'Barcha tariflarni olish — Ruxsat: ACCOUNTANT',
               security: [{ bearerAuth: [] }],
               parameters: [
                  {
                     name: 'type',
                     in: 'query',
                     required: false,
                     schema: {
                        type: 'string',
                        enum: ['JISMONIY', 'YURIDIK'],
                     },
                     description: 'Tarif turini filtrlash',
                  },
                  {
                     name: 'status',
                     in: 'query',
                     required: false,
                     schema: {
                        type: 'string',
                        enum: ['CURRENT', 'OLD', 'PENDING'],
                     },
                     description: 'Tarif holatini filtrlash',
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
                     description: 'Tariflar muvaffaqiyatli olindi',
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
                                          _id: {
                                             type: 'string',
                                             example:
                                                '64b8f1a2c3d4e5f6a7b8c9d0',
                                          },
                                          type: {
                                             type: 'string',
                                             enum: ['JISMONIY', 'YURIDIK'],
                                             example: 'JISMONIY',
                                          },
                                          monthly_rate: {
                                             type: 'number',
                                             example: 5000,
                                          },
                                          indoor_line_coefficient: {
                                             type: 'number',
                                             example: 1.0,
                                          },
                                          street_line_coefficient: {
                                             type: 'number',
                                             example: 0.7,
                                          },
                                          effective_date: {
                                             type: 'string',
                                             format: 'date-time',
                                             example:
                                                '2026-03-01T00:00:00.000Z',
                                          },
                                          status: {
                                             type: 'string',
                                             enum: [
                                                'CURRENT',
                                                'OLD',
                                                'PENDING',
                                             ],
                                             example: 'CURRENT',
                                          },
                                          created_at: {
                                             type: 'string',
                                             format: 'date-time',
                                          },
                                          updated_at: {
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
                  },
                  '401': { description: 'Autentifikatsiya xatosi' },
               },
            },
         },
      },
      {
         path: 'get-one/{id}',
         body: {
            get: {
               tags: ['Tariff'],
               summary: 'Bitta tarifni olish — Ruxsat: ACCOUNTANT',
               security: [{ bearerAuth: [] }],
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: { type: 'string' },
                     description: 'Tarif ID',
                  },
               ],
               responses: {
                  '200': {
                     description: 'Tarif muvaffaqiyatli olindi',
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
                                       type: {
                                          type: 'string',
                                          enum: ['JISMONIY', 'YURIDIK'],
                                       },
                                       monthly_rate: { type: 'number' },
                                       indoor_line_coefficient: {
                                          type: 'number',
                                       },
                                       street_line_coefficient: {
                                          type: 'number',
                                       },
                                       effective_date: {
                                          type: 'string',
                                          format: 'date-time',
                                       },
                                       status: {
                                          type: 'string',
                                          enum: ['CURRENT', 'OLD', 'PENDING'],
                                       },
                                    },
                                 },
                              },
                           },
                        },
                     },
                  },
                  '404': { description: 'Tarif topilmadi' },
               },
            },
         },
      },
      {
         path: 'update/{id}',
         body: {
            put: {
               tags: ['Tariff'],
               summary:
                  "Tarifni yangilash — PENDING bo'lsa update, aks holda yangi yaratadi — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: { type: 'string' },
                     description: 'Tarif ID',
                  },
               ],
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              monthly_rate: { type: 'number', example: 5000 },
                              indoor_line_coefficient: {
                                 type: 'number',
                                 example: 1.0,
                              },
                              street_line_coefficient: {
                                 type: 'number',
                                 example: 0.7,
                              },
                              effective_date: {
                                 type: 'string',
                                 format: 'date',
                                 example: '2026-04-01',
                              },
                           },
                           required: ['effective_date'],
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: 'PENDING tarif yangilandi',
                  },
                  '201': {
                     description:
                        'Yangi PENDING tarif yaratildi (eski tarif saqlanib qoldi)',
                  },
                  '404': { description: 'Tarif topilmadi' },
                  '422': { description: 'Validatsiya xatosi' },
               },
            },
         },
      },
   ],
}

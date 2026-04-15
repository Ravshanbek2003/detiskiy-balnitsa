import { SwaggerExamples } from './examples'

export const MainSwagger = {
   endpoint: 'main',
   paths: [
      {
         path: 'dashboard',
         body: {
            get: {
               tags: ['Main (Dashboard)'],
               summary:
                  'Bugungi kassa va umumiy hisobotlar statistikasi — Ruxsat: ACCOUNTANT',
               security: [{ bearerAuth: [] }],
               responses: {
                  '200': {
                     description: 'Muvaffaqiyatli',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.dashboard.today_dashboard,
                        },
                     },
                  },
                  '401': {
                     description: 'Unauthorized',
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
         path: 'revenue-summary',
         body: {
            get: {
               tags: ['Main (Reports)'],
               summary:
                  "Umumiy tushum, to'lov turlari va kunlik dinamika (Oylik/Haftalik) — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
               parameters: [
                  {
                     name: 'start_date',
                     in: 'query',
                     schema: {
                        type: 'string',
                        format: 'date',
                        example: '2023-01-01',
                     },
                  },
                  {
                     name: 'end_date',
                     in: 'query',
                     schema: {
                        type: 'string',
                        format: 'date',
                        example: '2023-01-31',
                     },
                  },
               ],
               responses: {
                  '200': {
                     description: 'Muvaffaqiyatli',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.dashboard.revenue_summary,
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
         path: 'doctors-report',
         body: {
            get: {
               tags: ['Main (Reports)'],
               summary:
                  "Shifokorlar bo'yicha qilingan tushum va bemorlar soni — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
               parameters: [
                  {
                     name: 'start_date',
                     in: 'query',
                     schema: { type: 'string', format: 'date' },
                  },
                  {
                     name: 'end_date',
                     in: 'query',
                     schema: { type: 'string', format: 'date' },
                  },
               ],
               responses: {
                  '200': {
                     description: 'Muvaffaqiyatli',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.dashboard.doctors_report,
                        },
                     },
                  },
               },
            },
         },
      },
      {
         path: 'specializations-report',
         body: {
            get: {
               tags: ['Main (Reports)'],
               summary:
                  "Yo'nalishlar bo'yicha qilingan tushum va bemorlar soni — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
               parameters: [
                  {
                     name: 'start_date',
                     in: 'query',
                     schema: { type: 'string', format: 'date' },
                  },
                  {
                     name: 'end_date',
                     in: 'query',
                     schema: { type: 'string', format: 'date' },
                  },
               ],
               responses: {
                  '200': {
                     description: 'Muvaffaqiyatli',
                     content: {
                        'application/json': {
                           example:
                              SwaggerExamples.dashboard.specializations_report,
                        },
                     },
                  },
               },
            },
         },
      },
      {
         path: 'workers-report',
         body: {
            get: {
               tags: ['Main (Reports)'],
               summary:
                  "Hamshira va yordamchilar qabuli bo'yicha hisobot — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
               parameters: [
                  {
                     name: 'start_date',
                     in: 'query',
                     schema: { type: 'string', format: 'date' },
                  },
                  {
                     name: 'end_date',
                     in: 'query',
                     schema: { type: 'string', format: 'date' },
                  },
               ],
               responses: {
                  '200': {
                     description: 'Muvaffaqiyatli',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.dashboard.workers_report,
                        },
                     },
                  },
               },
            },
         },
      },
   ],
}

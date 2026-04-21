export const salaryLogNurseSwagger = {
   endpoint: 'salary-log-nurse',
   paths: [
      {
         path: 'get-all',
         body: {
            get: {
               tags: ['Salary Log Nurse'],
               summary: "Bo'lim hamshiralari oylik maoshlari — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
               parameters: [
                  {
                     name: 'page',
                     in: 'query',
                     schema: { type: 'integer', default: 1 },
                  },
                  {
                     name: 'limit',
                     in: 'query',
                     schema: { type: 'integer', default: 10 },
                  },
                  {
                     name: 'department_id',
                     in: 'query',
                     schema: { type: 'string' },
                  },
                  {
                     name: 'worker_type',
                     in: 'query',
                     schema: { type: 'string', enum: ['nurse', 'assistant_nurse'] },
                  },
                  {
                     name: 'salary_month',
                     in: 'query',
                     schema: { type: 'string', example: '2026-04' },
                  },
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
                  200: {
                     description: 'Muvaffaqiyatli olingan',
                     content: {
                        'application/json': {
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean' },
                                 data: { type: 'array' },
                                 summary: { type: 'object' },
                                 pagination: { type: 'object' },
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
         path: 'get-one/:id',
         body: {
            get: {
               tags: ['Salary Log Nurse'],
               summary: 'Bitta hamshira maoshi logi — Ruxsat: ACCOUNTANT',
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
                  200: {
                     description: 'Muvaffaqiyatli olingan',
                     content: {
                        'application/json': {
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean' },
                                 data: { type: 'object' },
                              },
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

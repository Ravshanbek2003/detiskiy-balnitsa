export const salaryLogNurseSwagger = {
   endpoint: '/api/v1/salary-log-nurse',
   paths: {
      '/get-all': {
         get: {
            tags: ['Salary Log Nurse'],
            summary:
               'Barcha bo"lim hamshiralari oylik maoshlari (Faqat ACCOUNTANT uchun)',
            security: [{ bearerAuth: [] }],
            parameters: [
               {
                  name: 'page',
                  in: 'query',
                  schema: { type: 'number', default: 1 },
               },
               {
                  name: 'limit',
                  in: 'query',
                  schema: { type: 'number', default: 10 },
               },
               {
                  name: 'department_id',
                  in: 'query',
                  schema: { type: 'string' },
               },
               {
                  name: 'worker_type',
                  in: 'query',
                  schema: {
                     type: 'string',
                     enum: ['nurse', 'assistant_nurse'],
                  },
               },
               {
                  name: 'salary_month',
                  in: 'query',
                  schema: { type: 'string' },
                  description: 'Masalan: 2024-06',
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
                              success: { type: 'boolean', example: true },
                              data: {
                                 type: 'array',
                                 items: {
                                    type: 'object',
                                    properties: {
                                       _id: {
                                          type: 'string',
                                          example: '601f...',
                                       },
                                       department_id: {
                                          type: 'string',
                                          example: '601f...',
                                       },
                                       department_name: {
                                          type: 'string',
                                          example: 'Kardiologiya',
                                       },
                                       worker_type: {
                                          type: 'string',
                                          example: 'nurse',
                                       },
                                       salary_month: {
                                          type: 'string',
                                          example: '2024-06',
                                       },
                                       month_date: {
                                          type: 'string',
                                          format: 'date-time',
                                       },
                                       all_patient_count: {
                                          type: 'number',
                                          example: 120,
                                       },
                                       amount: {
                                          type: 'number',
                                          example: 1200000,
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
                              summary: {
                                 type: 'object',
                                 properties: {
                                    total_amount: {
                                       type: 'number',
                                       example: 2500000,
                                    },
                                    total_patient_count: {
                                       type: 'number',
                                       example: 250,
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
      '/get-one/{id}': {
         get: {
            tags: ['Salary Log Nurse'],
            summary:
               'Bitta hamshira maoshi logini olish (Faqat ACCOUNTANT uchun)',
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
                              success: { type: 'boolean', example: true },
                              data: {
                                 type: 'object',
                                 properties: {
                                    _id: { type: 'string', example: '601f...' },
                                    department_id: {
                                       type: 'string',
                                       example: '601f...',
                                    },
                                    department_name: {
                                       type: 'string',
                                       example: 'Kardiologiya',
                                    },
                                    worker_type: {
                                       type: 'string',
                                       example: 'nurse',
                                    },
                                    salary_month: {
                                       type: 'string',
                                       example: '2024-06',
                                    },
                                    month_date: {
                                       type: 'string',
                                       format: 'date-time',
                                    },
                                    all_patient_count: {
                                       type: 'number',
                                       example: 120,
                                    },
                                    amount: {
                                       type: 'number',
                                       example: 1200000,
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
}

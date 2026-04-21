import { SwaggerExamples } from './examples'

export const SalaryLogSwagger = {
   endpoint: 'salary-log',
   paths: [
      {
         path: 'get-all',
         body: {
            get: {
               tags: ['Salary Log'],
               summary: "Oylik ish haqi loglari ro'yxati — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
               parameters: [
                  { name: 'page', in: 'query', schema: { type: 'integer' } },
                  { name: 'limit', in: 'query', schema: { type: 'integer' } },
                  {
                     name: 'salary_month',
                     in: 'query',
                     schema: { type: 'string', example: '2026-04' },
                     description: 'Oy bo`yicha filter (YYYY-MM)',
                  },
                  {
                     name: 'worker_id',
                     in: 'query',
                     schema: { type: 'string' },
                  },
                  {
                     name: 'department_id',
                     in: 'query',
                     schema: { type: 'string' },
                     description: 'Bo`lim ID bo`yicha filter',
                  },
                  {
                     name: 'specialization_id',
                     in: 'query',
                     schema: { type: 'string' },
                     description: 'Mutaxassislik ID bo`yicha filter',
                  },
                  {
                     name: 'start_date',
                     in: 'query',
                     schema: { type: 'string', format: 'date' },
                     description: 'Boshlanish sanasi (YYYY-MM-DD)',
                  },
                  {
                     name: 'end_date',
                     in: 'query',
                     schema: { type: 'string', format: 'date' },
                     description: 'Tugash sanasi (YYYY-MM-DD)',
                  },
               ],
               responses: {
                  '200': {
                     description: "Oylik loglar ro'yxati",
                     content: {
                        'application/json': {
                           example: SwaggerExamples.salary_log.get_all,
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
         path: 'get-one/{id}',
         body: {
            get: {
               tags: ['Salary Log'],
               summary:
                  'Bitta oylik ish haqi logini olish — Ruxsat: ACCOUNTANT',
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
                     description: 'Oylik log topildi',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.salary_log.get_one,
                        },
                     },
                  },
                  '404': {
                     description: 'Oylik log topilmadi',
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

export const MainSwagger = {
   endpoint: 'main',
   paths: [
      {
         path: 'dashboard',
         body: {
            get: {
               tags: ['Main (Dashboard)'],
               summary: 'Bugungi kassa va umumiy hisobotlar statistikasi — Ruxsat: ACCOUNTANT',
               security: [{ bearerAuth: [] }],
               responses: { '200': { description: 'Muvaffaqiyatli' } }
            }
         }
      },
      {
         path: 'revenue-summary',
         body: {
            get: {
               tags: ['Main (Reports)'],
               summary: "Umumiy tushum, to'lov turlari va kunlik dinamika (Oylik/Haftalik) — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
               parameters: [
                  { name: 'start_date', in: 'query', schema: { type: 'string', format: 'date', example: '2023-01-01' } },
                  { name: 'end_date', in: 'query', schema: { type: 'string', format: 'date', example: '2023-01-31' } }
               ],
               responses: { '200': { description: 'Muvaffaqiyatli' } }
            }
         }
      },
      {
         path: 'doctors-report',
         body: {
            get: {
               tags: ['Main (Reports)'],
               summary: "Shifokorlar bo'yicha qilingan tushum va bemorlar soni — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
               parameters: [
                  { name: 'start_date', in: 'query', schema: { type: 'string', format: 'date' } },
                  { name: 'end_date', in: 'query', schema: { type: 'string', format: 'date' } }
               ],
               responses: { '200': { description: 'Muvaffaqiyatli' } }
            }
         }
      },
      {
         path: 'specializations-report',
         body: {
            get: {
               tags: ['Main (Reports)'],
               summary: "Yo'nalishlar bo'yicha qilingan tushum va bemorlar soni — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
               parameters: [
                  { name: 'start_date', in: 'query', schema: { type: 'string', format: 'date' } },
                  { name: 'end_date', in: 'query', schema: { type: 'string', format: 'date' } }
               ],
               responses: { '200': { description: 'Muvaffaqiyatli' } }
            }
         }
      },
      {
         path: 'workers-report',
         body: {
            get: {
               tags: ['Main (Reports)'],
               summary: "Hamshira va yordamchilar qabuli bo'yicha hisobot — Ruxsat: ACCOUNTANT",
               security: [{ bearerAuth: [] }],
               parameters: [
                  { name: 'start_date', in: 'query', schema: { type: 'string', format: 'date' } },
                  { name: 'end_date', in: 'query', schema: { type: 'string', format: 'date' } }
               ],
               responses: { '200': { description: 'Muvaffaqiyatli' } }
            }
         }
      }
   ]
}

import { param, query } from 'express-validator'

export class SalaryLogValidator {
   public static getAll = () => [
      query('page')
         .optional()
         .isInt({ min: 1, max: 1000 })
         .withMessage("Sahifa 1 dan 1000 gacha bo'lishi kerak."),

      query('limit')
         .optional()
         .isInt({ min: 1, max: 1000 })
         .withMessage("Limit 1 dan 1000 gacha bo'lishi kerak."),

      query('salary_month')
         .optional()
         .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
         .withMessage(
            "salary_month YYYY-MM formatida bo'lishi kerak. Masalan: 2026-04",
         ),

      query('worker_id')
         .optional()
         .isMongoId()
         .withMessage("Xodim ID noto'g'ri formatda."),

      query('department_id')
         .optional()
         .isMongoId()
         .withMessage("Department ID noto'g'ri formatda."),

      query('specialization_id')
         .optional()
         .isMongoId()
         .withMessage("Specialization ID noto'g'ri formatda."),

      query('start_date')
         .optional()
         .isISO8601()
         .withMessage("Boshlanish sanasi (start_date) noto'g'ri formatda."),

      query('end_date')
         .optional()
         .isISO8601()
         .withMessage("Tugash sanasi (end_date) noto'g'ri formatda."),
   ]

   public static mongoId = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage('Oylik log ID kiritilishi shart.')
         .bail()
         .isMongoId()
         .withMessage("Oylik log ID noto'g'ri formatda."),
   ]
}

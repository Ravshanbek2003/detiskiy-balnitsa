import { param, query } from 'express-validator'

export class SalaryLogNurseValidator {
   public static getAll = () => [
      query('page')
         .optional()
         .isInt({ min: 1, max: 1000 })
         .withMessage("Sahifa 1 dan 1000 gacha bo\\'lishi kerak."),

      query('limit')
         .optional()
         .isInt({ min: 1, max: 1000 })
         .withMessage("Limit 1 dan 100 gacha bo\\'lishi kerak."),

      query('department_id')
         .optional()
         .isMongoId()
         .withMessage("Bo\\'lim ID noto\\'g\\'ri formatda."),

      query('worker_type')
         .optional()
         .isIn(['nurse', 'assistant_nurse'])
         .withMessage(
            "Ishchi turi 'nurse' yoki 'assistant_nurse' bo\\'lishi kerak.",
         ),

      query('salary_month')
         .optional()
         .isString()
         .withMessage("Oylik (Yil-Oy) formati noto\\'g\\'ri."),

      query('start_date')
         .optional()
         .isISO8601()
         .withMessage(
            "start_date YYYY-MM-DD (Yil-Oy-Kun) formatida bo'lishi kerak",
         ),

      query('end_date')
         .optional()
         .isISO8601()
         .withMessage(
            "end_date YYYY-MM-DD (Yil-Oy-Kun) formatida bo'lishi kerak",
         ),
   ]

   public static mongoId = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage('ID kiritilishi shart.')
         .bail()
         .isMongoId()
         .withMessage("ID noto\\'g\\'ri formatda."),
   ]
}

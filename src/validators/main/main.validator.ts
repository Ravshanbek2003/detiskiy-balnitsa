import { query } from 'express-validator'

export class MainValidator {
   public static getTodayDashboard = () => [] 

   public static dateRange = () => [
      query('start_date')
         .optional()
         .isISO8601()
         .withMessage("start_date YYYY-MM-DD (Yil-Oy-Kun) formatida bo'lishi kerak"),
      query('end_date')
         .optional()
         .isISO8601()
         .withMessage("end_date YYYY-MM-DD (Yil-Oy-Kun) formatida bo'lishi kerak")
   ]
}

import { body, param, query } from 'express-validator'

export class DepartmentValidator {
   public static create = () => [
      body('name')
         .trim()
         .notEmpty()
         .withMessage("Bo'lim nomi kiritilishi shart.")
         .isString()
         .withMessage("Bo\\'lim nomi matn bo\\'lishi kerak."),

      body('share_percentages')
         .optional()
         .isObject()
         .withMessage("Ulishlar ob'ekt bo\\'lishi kerak."),

      body('share_percentages.doctor')
         .optional()
         .isNumeric()
         .withMessage("Shifokor ulushi raqam bo\\'lishi kerak.")
         .isFloat({ min: 0, max: 100 })
         .withMessage("Shifokor ulushi 0 va 100 oralig'ida bo\\'lishi kerak."),

      body('share_percentages.nurse')
         .optional()
         .isNumeric()
         .withMessage("Hamshira ulushi raqam bo\\'lishi kerak.")
         .isFloat({ min: 0, max: 100 })
         .withMessage("Hamshira ulushi 0 va 100 oralig'ida bo\\'lishi kerak."),

      body('share_percentages.assistant_nurse')
         .optional()
         .isNumeric()
         .withMessage("Kichik hamshira ulushi raqam bo\\'lishi kerak.")
         .isFloat({ min: 0, max: 100 })
         .withMessage(
            "Kichik hamshira ulushi 0 va 100 oralig'ida bo\\'lishi kerak.",
         ),

      body('description')
         .optional()
         .trim()
         .isString()
         .withMessage("Ta'rif matn bo\\'lishi kerak."),

      body('is_active')
         .optional()
         .isBoolean()
         .withMessage("Faollik holati mantiqiy (boolean) bo\\'lishi kerak."),
   ]

   public static update = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage("Bo\\'lim ID kiritilishi shart.")
         .isMongoId()
         .withMessage("Bo\\'lim ID noto\\'g\\'ri formatda."),

      body('name')
         .optional()
         .trim()
         .notEmpty()
         .withMessage("Bo\\'lim nomi bo\\'sh bo\\'lishi mumkin emas.")
         .isString()
         .withMessage("Bo\\'lim nomi matn bo\\'lishi kerak."),

      body('share_percentages')
         .optional()
         .isObject()
         .withMessage("Ulishlar ob'ekt bo\\'lishi kerak."),

      body('share_percentages.doctor')
         .optional()
         .isNumeric()
         .withMessage("Shifokor ulushi raqam bo\\'lishi kerak.")
         .isFloat({ min: 0, max: 100 })
         .withMessage("Shifokor ulushi 0 va 100 oralig'ida bo\\'lishi kerak."),

      body('share_percentages.nurse')
         .optional()
         .isNumeric()
         .withMessage("Hamshira ulushi raqam bo\\'lishi kerak.")
         .isFloat({ min: 0, max: 100 })
         .withMessage("Hamshira ulushi 0 va 100 oralig'ida bo\\'lishi kerak."),

      body('share_percentages.assistant_nurse')
         .optional()
         .isNumeric()
         .withMessage("Kichik hamshira ulushi raqam bo\\'lishi kerak.")
         .isFloat({ min: 0, max: 100 })
         .withMessage(
            "Kichik hamshira ulushi 0 va 100 oralig'ida bo\\'lishi kerak.",
         ),

      body('description')
         .optional()
         .trim()
         .isString()
         .withMessage("Ta'rif matn bo\\'lishi kerak."),

      body('is_active')
         .optional()
         .isBoolean()
         .withMessage("Faollik holati mantiqiy (boolean) bo\\'lishi kerak."),
   ]

   public static getAll = () => [
      query('page')
         .optional()
         .isInt({ min: 1, max: 1000 })
         .withMessage("Sahifa 1 dan 1000 gacha bo\\'lishi kerak."),

      query('limit')
         .optional()
         .isInt({ min: 1, max: 100 })
         .withMessage("Limit 1 dan 100 gacha bo\\'lishi kerak."),

      query('search')
         .optional()
         .isString()
         .withMessage("Qidiruv matni matn bo\\'lishi kerak."),

      query('is_active')
         .optional()
         .isBoolean()
         .withMessage("Faollik holati mantiqiy (boolean) bo\\'lishi kerak."),
   ]

   public static mongoId = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage("Bo\\'lim ID kiritilishi shart.")
         .bail()
         .isMongoId()
         .withMessage("Bo\\'lim ID noto\\'g\\'ri formatda."),
   ]
}

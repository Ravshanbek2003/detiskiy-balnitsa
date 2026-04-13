import { body, param, query } from 'express-validator'

export class SpecializationValidator {
   public static create = () => [
      body('service_code')
         .optional()
         .trim()
         .isString()
         .withMessage("Xizmat kodi matn bo\\'lishi kerak."),

      body('name')
         .trim()
         .notEmpty()
         .withMessage("Yo\\'nalish nomi kiritilishi shart.")
         .isString()
         .withMessage("Yo\\'nalish nomi matn bo\\'lishi kerak."),

      body('department_id')
         .trim()
         .notEmpty()
         .withMessage("Bo\\'lim ID kiritilishi shart.")
         .isMongoId()
         .withMessage("Bo\\'lim ID noto\\'g\\'ri formatda."),

      body('price_local')
         .notEmpty()
         .withMessage('Mahalliy narx kiritilishi shart.')
         .isNumeric()
         .withMessage("Mahalliy narx raqam bo\\'lishi kerak.")
         .isFloat({ min: 0 })
         .withMessage("Mahalliy narx manfiy bo\\'lmasligi kerak."),

      body('price_foreign')
         .notEmpty()
         .withMessage('Xorijiy narx kiritilishi shart.')
         .isNumeric()
         .withMessage("Xorijiy narx raqam bo\\'lishi kerak.")
         .isFloat({ min: 0 })
         .withMessage("Xorijiy narx manfiy bo\\'lmasligi kerak."),

      body('location')
         .optional()
         .isObject()
         .withMessage("Manzil ob'ekt bo\\'lishi kerak."),

      body('location.building')
         .optional()
         .trim()
         .isString()
         .withMessage("Bino matn bo\\'lishi kerak."),

      body('location.floor')
         .optional()
         .isNumeric()
         .withMessage("Qavat raqam bo\\'lishi kerak."),

      body('location.room')
         .optional()
         .trim()
         .isString()
         .withMessage("Xona matn bo\\'lishi kerak."),

      body('is_active')
         .optional()
         .isBoolean()
         .withMessage("Faollik holati mantiqiy (boolean) bo\\'lishi kerak."),
   ]

   public static update = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage("Yo\\'nalish ID kiritilishi shart.")
         .isMongoId()
         .withMessage("Yo\\'nalish ID noto\\'g\\'ri formatda."),

      body('service_code')
         .optional()
         .trim()
         .isString()
         .withMessage("Xizmat kodi matn bo\\'lishi kerak."),

      body('name')
         .optional()
         .trim()
         .notEmpty()
         .withMessage("Yo\\'nalish nomi bo\\'sh bo\\'lishi mumkin emas.")
         .isString()
         .withMessage("Yo\\'nalish nomi matn bo\\'lishi kerak."),

      body('department_id')
         .optional()
         .trim()
         .notEmpty()
         .withMessage("Bo\\'lim ID bo\\'sh bo\\'lishi mumkin emas.")
         .isMongoId()
         .withMessage("Bo\\'lim ID noto\\'g\\'ri formatda."),

      body('price_local')
         .optional()
         .isNumeric()
         .withMessage("Mahalliy narx raqam bo\\'lishi kerak.")
         .isFloat({ min: 0 })
         .withMessage("Mahalliy narx manfiy bo\\'lmasligi kerak."),

      body('price_foreign')
         .optional()
         .isNumeric()
         .withMessage("Xorijiy narx raqam bo\\'lishi kerak.")
         .isFloat({ min: 0 })
         .withMessage("Xorijiy narx manfiy bo\\'lmasligi kerak."),

      body('location')
         .optional()
         .isObject()
         .withMessage("Manzil ob'ekt bo\\'lishi kerak."),

      body('location.building')
         .optional()
         .trim()
         .isString()
         .withMessage("Bino matn bo\\'lishi kerak."),

      body('location.floor')
         .optional()
         .isNumeric()
         .withMessage("Qavat raqam bo\\'lishi kerak."),

      body('location.room')
         .optional()
         .trim()
         .isString()
         .withMessage("Xona matn bo\\'lishi kerak."),

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

      query('department_id')
         .optional()
         .isMongoId()
         .withMessage("Bo\\'lim ID noto\\'g\\'ri formatda."),

      query('is_active')
         .optional()
         .isBoolean()
         .withMessage("Faollik holati mantiqiy (boolean) bo\\'lishi kerak."),
   ]

   public static mongoId = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage("Yo\\'nalish ID kiritilishi shart.")
         .bail()
         .isMongoId()
         .withMessage("Yo\\'nalish ID noto\\'g\\'ri formatda."),
   ]
}

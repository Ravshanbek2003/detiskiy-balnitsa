import { body, param, query } from 'express-validator'

const patientPaymentMethods = ['cash', 'card', 'click']

export class PatientValidator {
   public static create = () => [
      body('full_name')
         .trim()
         .notEmpty()
         .withMessage('Bemor ismi kiritilishi shart.')
         .isString()
         .withMessage("Bemor ismi matn bo\\'lishi kerak."),

      body('check_number')
         .trim()
         .notEmpty()
         .withMessage('Chek raqami kiritilishi shart.')
         .isString()
         .withMessage("Chek raqami matn bo\\'lishi kerak."),

      body('department_id')
         .optional()
         .isMongoId()
         .withMessage("Bo\\'lim ID noto\\'g\\'ri formatda."),

      body('department_name')
         .optional()
         .trim()
         .isString()
         .withMessage("Bo\\'lim nomi matn bo\\'lishi kerak."),

      body('specialization_id')
         .optional()
         .isMongoId()
         .withMessage("Yo\\'nalish ID noto\\'g\\'ri formatda."),

      body('specialization_name')
         .optional()
         .trim()
         .isString()
         .withMessage("Yo\\'nalish nomi matn bo\\'lishi kerak."),

      body('doctor')
         .optional()
         .isMongoId()
         .withMessage("Shifokor ID noto\\'g\\'ri formatda."),

      body('doctor_name')
         .optional()
         .trim()
         .isString()
         .withMessage("Shifokor ismi matn bo\\'lishi kerak."),

      body('amount')
         .notEmpty()
         .withMessage("To'lov summasi kiritilishi shart.")
         .isNumeric()
         .withMessage("To\\'lov summasi raqam bo\\'lishi kerak.")
         .isFloat({ min: 0 })
         .withMessage("Summa manfiy bo\\'lmasligi kerak."),

      body('payment_method')
         .notEmpty()
         .withMessage("To'lov usuli kiritilishi shart.")
         .isIn(patientPaymentMethods)
         .withMessage(
            "To'lov usuli " +
               patientPaymentMethods.join(', ') +
               " dan biri bo\\'lishi kerak.",
         ),

      body('payment_status')
         .optional()
         .isIn(['paid', 'unpaid'])
         .withMessage("To\\'lov holati 'paid' yoki 'unpaid' bo\\'lishi kerak."),

      body('country')
         .optional()
         .isIn(['UZB', 'OTHERS'])
         .withMessage("Mamlakat 'UZB' yoki 'OTHERS' bo\\'lishi kerak."),
   ]

   public static update = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage('Bemor ID kiritilishi shart.')
         .isMongoId()
         .withMessage("Bemor ID noto\\'g\\'ri formatda."),

      body('full_name')
         .optional()
         .trim()
         .isString()
         .withMessage("Bemor ismi matn bo\\'lishi kerak."),

      body('check_number')
         .optional()
         .trim()
         .isString()
         .withMessage("Chek raqami matn bo\\'lishi kerak."),

      body('department_id')
         .optional()
         .isMongoId()
         .withMessage("Bo\\'lim ID noto\\'g\\'ri formatda."),

      body('department_name')
         .optional()
         .trim()
         .isString()
         .withMessage("Bo\\'lim nomi matn bo\\'lishi kerak."),

      body('specialization_id')
         .optional()
         .isMongoId()
         .withMessage("Yo\\'nalish ID noto\\'g\\'ri formatda."),

      body('specialization_name')
         .optional()
         .trim()
         .isString()
         .withMessage("Yo\\'nalish nomi matn bo\\'lishi kerak."),

      body('doctor')
         .optional()
         .isMongoId()
         .withMessage("Shifokor ID noto\\'g\\'ri formatda."),

      body('doctor_name')
         .optional()
         .trim()
         .isString()
         .withMessage("Shifokor ismi matn bo\\'lishi kerak."),

      body('amount')
         .optional()
         .isNumeric()
         .withMessage("To\\'lov summasi raqam bo\\'lishi kerak.")
         .isFloat({ min: 0 })
         .withMessage("Summa manfiy bo\\'lmasligi kerak."),

      body('payment_method')
         .optional()
         .isIn(patientPaymentMethods)
         .withMessage(
            "To'lov usuli " +
               patientPaymentMethods.join(', ') +
               " dan biri bo\\'lishi kerak.",
         ),

      body('payment_status')
         .optional()
         .isIn(['paid', 'unpaid'])
         .withMessage("To\\'lov holati 'paid' yoki 'unpaid' bo\\'lishi kerak."),

      body('country')
         .optional()
         .isIn(['UZB', 'OTHERS'])
         .withMessage("Mamlakat 'UZB' yoki 'OTHERS' bo\\'lishi kerak."),
   ]

   public static getAll = () => [
      query('page')
         .optional()
         .isInt({ min: 1, max: 1000 })
         .withMessage("Sahifa 1 dan 1000 gacha bo\\'lishi kerak."),

      query('limit')
         .optional()
         .isInt({ min: 1, max: 1000 })
         .withMessage("Limit 1 dan 1000 gacha bo\\'lishi kerak."),

      query('search')
         .optional()
         .isString()
         .withMessage("Qidiruv matni matn bo\\'lishi kerak."),

      query('department_id')
         .optional()
         .isMongoId()
         .withMessage("Bo\\'lim ID noto\\'g\\'ri formatda."),

      query('specialization_id')
         .optional()
         .isMongoId()
         .withMessage("Yo\\'nalish ID noto\\'g\\'ri formatda."),

      query('payment_method')
         .optional()
         .isIn(patientPaymentMethods)
         .withMessage("To\\'lov usuli ro\\'yxatdan bo\\'lishi kerak."),

      query('payment_status')
         .optional()
         .isIn(['paid', 'unpaid'])
         .withMessage("To\\'lov holati 'paid' yoki 'unpaid' bo\\'lishi kerak."),

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

      query('country')
         .optional()
         .isIn(['UZB', 'OTHERS'])
         .withMessage("Mamlakat 'UZB' yoki 'OTHERS' bo\\'lishi kerak."),

      query('created_by')
         .optional()
         .isMongoId()
         .withMessage("Yaratgan foydalanuvchi ID noto\\'g\\'ri formatda."),
   ]

   public static mongoId = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage('Bemor ID kiritilishi shart.')
         .bail()
         .isMongoId()
         .withMessage("Bemor ID noto\\'g\\'ri formatda."),
   ]

   public static updatePaymentStatus = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage('Bemor ID kiritilishi shart.')
         .isMongoId()
         .withMessage("Bemor ID noto\\'g\\'ri formatda."),

      body('payment_status')
         .notEmpty()
         .withMessage("To\\'lov holati kiritilishi shart.")
         .isIn(['paid', 'unpaid'])
         .withMessage("To\\'lov holati 'paid' yoki 'unpaid' bo\\'lishi kerak."),
   ]
}

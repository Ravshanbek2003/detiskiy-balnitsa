import { body, param, query } from 'express-validator'

export class WorkerValidator {
   public static create = () => [
      body('fullname')
         .trim()
         .notEmpty()
         .withMessage("Ism (To'liq ism) kiritilishi shart.")
         .isString()
         .withMessage("Ism matn bo'lishi kerak."),

      body('phone')
         .trim()
         .notEmpty()
         .withMessage('Telefon raqami kiritilishi shart.')
         .isString()
         .withMessage("Telefon raqami matn bo'lishi kerak.")
         .matches(/^\+998\d{9}$/)
         .withMessage("Telefon raqami +998XXXXXXXXX formatida bo'lishi kerak."),

      body('image')
         .optional()
         .isString()
         .withMessage("Rasm formatida bo'lishi kerak."),

      body('department_id')
         .trim()
         .notEmpty()
         .withMessage("Bo'lim kiritilishi shart.")
         .isMongoId()
         .withMessage("Bo'lim ID noto'g'ri formatda."),

      body('specialization_id')
         .trim()
         .optional()
         .isString()
         .isMongoId()
         .withMessage("Mutaxassislik ID noto'g'ri formatda."),

      body('worker_type')
         .trim()
         .notEmpty()
         .withMessage('Xodim turi kiritilishi shart.')
         .isIn(['doctor', 'nurse', 'assistant_nurse'])
         .withMessage(
            "Xodim turi: 'doctor', 'nurse' yoki 'assistant_nurse' bo'lishi kerak.",
         ),

      body('notes')
         .optional()
         .isString()
         .withMessage("Qo'shimcha malumot matn bo'lishi kerak."),
   ]

   public static update = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage('ID kiritilishi shart.')
         .isMongoId()
         .withMessage("ID noto'g'ri formatda."),

      body('fullname')
         .optional()
         .trim()
         .notEmpty()
         .withMessage("Ism bo'sh bo'lishi mumkin emas.")
         .isString()
         .withMessage("Ism matn bo'lishi kerak."),

      body('phone')
         .optional()
         .trim()
         .notEmpty()
         .withMessage("Telefon raqami bo'sh bo'lishi mumkin emas.")
         .isString()
         .matches(/^\+998\d{9}$/)
         .withMessage("Telefon raqami +998XXXXXXXXX formatida bo'lishi kerak."),

      body('image')
         .optional()
         .isString()
         .withMessage("Rasm formatida bo'lishi kerak."),

      body('department_id')
         .optional()
         .trim()
         .notEmpty()
         .isMongoId()
         .withMessage("Bo'lim ID noto'g'ri formatda."),

      body('specialization_id')
         .optional()
         .trim()
         .notEmpty()
         .isMongoId()
         .withMessage("Mutaxassislik ID noto'g'ri formatda."),

      body('worker_type')
         .optional()
         .trim()
         .notEmpty()
         .isIn(['doctor', 'nurse', 'assistant_nurse'])
         .withMessage(
            "Xodim turi: 'doctor', 'nurse' yoki 'assistant_nurse' bo'lishi kerak.",
         ),

      body('notes')
         .optional()
         .isString()
         .withMessage("Qo'shimcha malumot matn bo'lishi kerak."),
   ]

   public static getAll = () => [
      query('page')
         .optional()
         .isInt({ min: 1, max: 1000 })
         .withMessage("Sahifa 1 dan 1000 gacha bo'lishi kerak."),

      query('limit')
         .optional()
         .isInt({ min: 1, max: 100 })
         .withMessage("Limit 1 dan 100 gacha bo'lishi kerak."),

      query('worker_type')
         .optional()
         .isIn(['doctor', 'nurse', 'assistant_nurse'])
         .withMessage("Xodim turi noto'g'ri."),

      query('status')
         .optional()
         .isIn(['active', 'inactive', 'deleted'])
         .withMessage("Status noto'g'ri."),

      query('department_id')
         .optional()
         .isMongoId()
         .withMessage("Bo'lim ID noto'g'ri formatda."),

      query('specialization_id')
         .optional()
         .isMongoId()
         .withMessage("Mutaxassislik ID noto'g'ri formatda."),

      query('search')
         .optional()
         .isString()
         .withMessage("Qidiruv matni matn bo'lishi kerak."),
   ]

   public static mongoId = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage('Xodim ID kiritilishi shart.')
         .bail()
         .isMongoId()
         .withMessage("Xodim ID noto'g'ri formatda."),
   ]
}

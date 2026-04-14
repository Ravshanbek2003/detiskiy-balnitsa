import { body } from 'express-validator'

export class AuthValidator {
   public static login = () => [
      body('login')
         .trim()
         .notEmpty()
         .withMessage('Login kiritilishi shart.')
         .isString()
         .withMessage("Login matn bo'lishi kerak."),

      body('password')
         .trim()
         .notEmpty()
         .withMessage('Parol kiritilishi shart.')
         .isString()
         .withMessage("Parol matn bo'lishi kerak.")
         .isLength({ min: 4, max: 16 })
         .withMessage("Parol 4 dan 16 gacha belgi bo'lishi kerak."),
   ]

   public static signUpAccountant = () => [
      body('fullname')
         .trim()
         .notEmpty()
         .withMessage('Ism kiritilishi shart.')
         .isString()
         .withMessage("Ism matn bo'lishi kerak."),

      body('login')
         .trim()
         .notEmpty()
         .withMessage('Login kiritilishi shart.')
         .isString()
         .withMessage("Login matn bo'lishi kerak."),

      body('phone')
         .optional()
         .trim()
         .notEmpty()
         .withMessage("Telefon raqami bo'sh bo'lishi mumkin emas.")
         .isString()
         .withMessage("Telefon raqami matn bo'lishi kerak.")
         .matches(/^\+998\d{9}$/)
         .withMessage("Telefon raqami +998XXXXXXXXX formatida bo'lishi kerak."),

      body('password')
         .trim()
         .notEmpty()
         .withMessage('Parol kiritilishi shart.')
         .isString()
         .withMessage("Parol matn bo'lishi kerak.")
         .isLength({ min: 4, max: 16 })
         .withMessage("Parol 4 dan 16 gacha belgi bo'lishi kerak."),

      body('reg_key')
         .trim()
         .notEmpty()
         .withMessage("Ro'yxatdan o'tish kaliti kiritilishi shart.")
         .isString()
         .withMessage("Ro'yxatdan o'tish kaliti matn bo'lishi kerak."),
   ]

   public static updateMe = () => [
      body('fullname')
         .optional()
         .trim()
         .notEmpty()
         .withMessage("Ism bo'sh bo'lishi mumkin emas.")
         .isString()
         .withMessage("Ism matn bo'lishi kerak."),

      body('login')
         .optional()
         .trim()
         .notEmpty()
         .withMessage("Login bo'sh bo'lishi mumkin emas.")
         .isString()
         .withMessage("Login matn bo'lishi kerak."),

      body('phone')
         .optional()
         .trim()
         .notEmpty()
         .withMessage("Telefon raqami bo'sh bo'lishi mumkin emas.")
         .isString()
         .withMessage("Telefon raqami matn bo'lishi kerak.")
         .matches(/^\+998\d{9}$/)
         .withMessage("Telefon raqami +998XXXXXXXXX formatida bo'lishi kerak."),

      body('image')
         .optional()
         .isURL()
         .withMessage("Rasm URL manzil bo'lishi kerak."),
   ]

   public static updatePassword = () => [
      body('new_password')
         .trim()
         .notEmpty()
         .withMessage('Yangi parol kiritilishi shart.')
         .isString()
         .withMessage("Yangi parol matn bo'lishi kerak.")
         .isLength({ min: 4, max: 16 })
         .withMessage("Yangi parol 4 dan 16 gacha belgi bo'lishi kerak."),
   ]
}

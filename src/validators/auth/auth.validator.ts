import { body } from 'express-validator'

export class AuthValidator {
   public static login = () => [
      body().custom(value => {
         const login = value?.login || value?.phone

         if (!login || typeof login !== 'string' || !login.trim()) {
            throw new Error('Login kiritilishi shart.')
         }

         if (!/^\+998\d{9}$/.test(login.trim())) {
            throw new Error(
               "Login hozircha telefon raqami ko'rinishida bo'lishi kerak: +998XXXXXXXXX",
            )
         }

         return true
      }),

      body('password')
         .trim()
         .notEmpty()
         .withMessage('Parol kiritilishi shart.')
         .isString()
         .withMessage("Parol matn bo'lishi kerak.")
         .isLength({ min: 4, max: 16 })
         .withMessage("Parol 4 dan 16 gacha belgi bo'lishi kerak."),
   ]

   public static signUpAdmin = () => [
      body('fullname')
         .trim()
         .notEmpty()
         .withMessage('Ism kiritilishi shart.')
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

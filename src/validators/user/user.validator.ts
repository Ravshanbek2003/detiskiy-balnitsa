import { body, param, query } from 'express-validator'

import { RoleConstants, StatusConstants } from '../../constants'

export class UserValidator {
   public static create = () => [
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

      body('role')
         .trim()
         .notEmpty()
         .withMessage('Rol kiritilishi shart.')
         .isIn(Object.values(RoleConstants))
         .withMessage(
            'Rol qiymati ' +
               Object.values(RoleConstants).join(', ') +
               " dan biri bo'lishi kerak.",
         ),
   ]

   public static update = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage('Foydalanuvchi ID kiritilishi shart.')
         .isMongoId()
         .withMessage("Foydalanuvchi ID noto'g'ri formatda."),

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

      body('password')
         .optional()
         .trim()
         .notEmpty()
         .withMessage("Parol bo'sh bo'lishi mumkin emas.")
         .isString()
         .withMessage("Parol matn bo'lishi kerak.")
         .isLength({ min: 4, max: 16 })
         .withMessage("Parol 4 dan 16 gacha belgi bo'lishi kerak."),

      body('role')
         .optional()
         .trim()
         .notEmpty()
         .withMessage("Rol bo'sh bo'lishi mumkin emas.")
         .isIn(Object.values(RoleConstants))
         .withMessage(
            'Rol qiymati ' +
               Object.values(RoleConstants).join(', ') +
               " dan biri bo'lishi kerak.",
         ),
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

      query('role')
         .optional()
         .isIn(Object.values(RoleConstants))
         .withMessage(
            'Rol qiymati ' +
               Object.values(RoleConstants).join(', ') +
               " dan biri bo'lishi kerak.",
         ),

      query('status')
         .optional()
         .isIn(Object.values(StatusConstants))
         .withMessage(
            'Status qiymati ' +
               Object.values(StatusConstants).join(', ') +
               " dan biri bo'lishi kerak.",
         ),

      query('search')
         .optional()
         .isString()
         .withMessage("Qidiruv matni matn bo'lishi kerak."),

      query('startDate')
         .optional()
         .isISO8601()
         .withMessage(
            "Boshlanish sanasi to'g'ri formatda bo'lishi kerak (YYYY-MM-DD).",
         ),

      query('endDate')
         .optional()
         .isISO8601()
         .withMessage(
            "Tugash sanasi to'g'ri formatda bo'lishi kerak (YYYY-MM-DD).",
         ),
   ]

   public static mongoId = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage('Foydalanuvchi ID kiritilishi shart.')
         .bail()
         .isMongoId()
         .withMessage("Foydalanuvchi ID noto'g'ri formatda."),
   ]
}

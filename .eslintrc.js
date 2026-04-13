module.exports = {
   root: true,
   parser: '@typescript-eslint/parser',
   plugins: [
      '@typescript-eslint',
      'prettier',
      'import',
      'unicorn',
      'prefer-arrow',
   ],
   extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
   ],
   rules: {
      // === Code style & structure ===
      'no-var': 'error', // var taqiqlanadi
      'prefer-const': 'error', // o‘zgarmaydigan o‘zgaruvchi const bo‘lsin
      'prefer-arrow/prefer-arrow-functions': 'error', // arrow function majburiy
      'no-console': 'error', // console.log va boshqalar taqiqlanadi

      // === Naming conventions ===
      'unicorn/filename-case': [
         'error',
         {
            cases: {
               kebabCase: true,
            },
         },
      ],
      '@typescript-eslint/naming-convention': [
         'error',
         { selector: 'variableLike', format: ['camelCase'] },
         { selector: 'typeLike', format: ['PascalCase'] },
      ],

      // === Import qoidalari ===
      'import/no-default-export': 'error', // default export taqiqlanadi
      'import/no-extraneous-dependencies': 'error', // package.jsonda bo‘lmagan importlar taqiqlanadi
      'import/named': 'error', // importdagi nomlar to‘g‘riligini tekshiradi
      'import/namespace': 'error',

      // === TypeScript qoidalari ===
      '@typescript-eslint/explicit-function-return-type': 'off', // har safar return type shart emas
      '@typescript-eslint/no-unused-vars': ['error'], // foydalanilmagan o‘zgaruvchilar taqiqlanadi
      '@typescript-eslint/no-explicit-any': 'warn', // any ishlatish tavsiya etilmaydi

      // === Prettier integratsiyasi ===
      'prettier/prettier': [
         'error',
         {
            semi: false,
            singleQuote: true,
            trailingComma: 'all',
            endOfLine: 'auto',
         },
      ],
   },
   settings: {
      'import/resolver': {
         typescript: {},
         node: {
            extensions: ['.js', '.ts'],
         },
      },
   },
}

export const RoleConstants = {
   CASHIER: 'CASHIER',
   ACCOUNTANT: 'ACCOUNTANT',
} as const

export const StatusConstants = {
   ACTIVE: 'active',
   BLOCKED: 'blocked',
   DELETED: 'deleted',
} as const

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

const endpointRoles: Record<
   string,
   Record<string, Partial<Record<HttpMethod, readonly string[]>>>
> = {
   user: {
      '/create': { POST: [RoleConstants.ACCOUNTANT] },
      '/get-all': { GET: [RoleConstants.ACCOUNTANT] },
      '/get-one/:id': { GET: [RoleConstants.ACCOUNTANT] },
      '/update/:id': { PUT: [RoleConstants.ACCOUNTANT] },
      '/delete/:id': { DELETE: [RoleConstants.ACCOUNTANT] },
      '/block/:id': { PATCH: [RoleConstants.ACCOUNTANT] },
   },
   department: {
      '/create': { POST: [RoleConstants.CASHIER] },
      '/get-all': { GET: [RoleConstants.CASHIER] },
      '/get-one/:id': { GET: [RoleConstants.CASHIER] },
      '/update/:id': { PUT: [RoleConstants.CASHIER] },
      '/delete/:id': { DELETE: [RoleConstants.CASHIER] },
      '/activate/:id': { PATCH: [RoleConstants.CASHIER] },
   },
   specialization: {
      '/create': { POST: [RoleConstants.CASHIER] },
      '/get-all': { GET: [RoleConstants.CASHIER] },
      '/get-one/:id': { GET: [RoleConstants.CASHIER] },
      '/update/:id': { PUT: [RoleConstants.CASHIER] },
      '/delete/:id': { DELETE: [RoleConstants.CASHIER] },
      '/activate/:id': { PATCH: [RoleConstants.CASHIER] },
   },
   patient: {
      '/create': { POST: [RoleConstants.CASHIER] },
      '/get-all': { GET: [RoleConstants.CASHIER] },
      '/get-one/:id': { GET: [RoleConstants.CASHIER] },
      '/update/:id': { PUT: [RoleConstants.CASHIER] },
      '/delete/:id': { DELETE: [RoleConstants.CASHIER] },
      '/update-payment-status/:id': { PATCH: [RoleConstants.CASHIER] },
   },
}

type RoleValue = (typeof RoleConstants)[keyof typeof RoleConstants]

export function getEndpointRoles(
   module: string,
   path: string,
   method: string,
): RoleValue[] {
   return [
      ...(endpointRoles[module]?.[path]?.[method as HttpMethod] || []),
   ] as RoleValue[]
}

export const ErrorMessages = {
   USER_NOT_FOUND: 'Foydalanuvchi topilmadi',
   SUBSCRIBER_NOT_FOUND: 'Abonent topilmadi',
   INVALID_CREDENTIALS: "Telefon raqami yoki parol noto'g'ri",
   INVALID_SUBSCRIBER_CREDENTIALS: "Abonent raqami yoki parol noto'g'ri",      
   OTP_EXPIRED: 'Tasdiqlash kodi muddati tugagan',
   OTP_INVALID: "Tasdiqlash kodi noto'g'ri",
   OTP_NOT_FOUND: 'Tasdiqlash kodi topilmadi',
   FORBIDDEN: 'Sizga ruxsat berilmagan',
   ADMIN_EXISTS: "Admin allaqachon ro'yxatdan o'tgan",
   PHONE_EXISTS: 'Telefon raqam allaqachon band',
   USER_BLOCKED: 'Foydalanuvchi bloklangan',
   SUBSCRIBER_FROZEN: "Abonent muzlatilgan, tizimga kirishga ruxsat yo'q",     
   NO_FILE_UPLOADED: 'Fayl yuklanmadi',
} as const

export const SuccessMessages = {
   UPDATED: 'Muvaffaqiyatli yangilandi',
   CREATED: 'Muvaffaqiyatli yaratildi',
   DELETED: "Muvaffaqiyatli o'chirildi",
   USER_CREATED: 'Foydalanuvchi muvaffaqiyatli yaratildi',
   USER_UPDATED: 'Foydalanuvchi muvaffaqiyatli yangilandi',
   USER_DELETED: "Foydalanuvchi muvaffaqiyatli o'chirildi",
   USER_BLOCKED: 'Foydalanuvchi bloklandi',
   USER_UNBLOCKED: 'Foydalanuvchi blokdan chiqarildi',
   OTP_SENT: 'Tasdiqlash kodi yuborildi',
   OTP_RESENT: 'Tasdiqlash kodi qayta yuborildi',
   LOGIN_SUCCESS: 'Muvaffaqiyatli kirildi',
   ADMIN_CREATED: "Admin muvaffaqiyatli ro'yxatdan o'tdi",
   PASSWORD_UPDATED: 'Parol muvaffaqiyatli yangilandi',
   SUBSCRIBER_CODE_SENT: 'Parol abonentning telefon raqamiga yuborildi',       
} as const

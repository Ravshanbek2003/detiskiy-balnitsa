import { Types } from 'mongoose'

import { TariffDocumentI, TariffModel, TariffType } from '../models'

// CHANGE START: tarif helperlari va billing formulasi TZga mos qayta yozildi.
type SubscriberType = 'INDIVIDUAL' | 'LEGAL_ENTITY'
type WaterType = 'INDOOR' | 'OUTDOOR'
type BillingMode = 'FIXED' | 'METERED'

type TariffSnapshot = Pick<
   TariffDocumentI,
   | 'monthly_rate'
   | 'price_per_m3'
   | 'indoor_line_coefficient'
   | 'street_line_coefficient'
>

interface CalculateWaterBillInput {
   billingMode: BillingMode
   waterType: WaterType
   tariff: TariffSnapshot
   consumptionM3?: number
   familyMembers?: number
   fallbackPricePerM3?: number
}

/**
 * Har oyning 1-sanasida CURRENT -> OLD, PENDING -> CURRENT qiladi
 */
export const activatePendingTariffs = async (): Promise<void> => {
   const now = new Date()
   const monthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))

   const pendingTariffs = await TariffModel.find({
      status: 'PENDING',
      effective_date: { $lte: monthStart },
   })

   if (pendingTariffs.length === 0) return

   const types = [...new Set(pendingTariffs.map(tariff => tariff.type))]

   await TariffModel.updateMany(
      { type: { $in: types }, status: 'CURRENT' },
      { $set: { status: 'OLD' } },
   )

   await TariffModel.updateMany(
      { status: 'PENDING', effective_date: { $lte: monthStart } },
      { $set: { status: 'CURRENT' } },
   )

   console.info(
      `[Tariff Cron] ${pendingTariffs.length} tarif(s) activated. Types: ${types.join(', ')}. Date: ${now.toISOString()}`,
   )
}

export const resolveTariffType = (subscriberType: SubscriberType): TariffType =>
   subscriberType === 'LEGAL_ENTITY' ? 'YURIDIK' : 'JISMONIY'

export const resolveLineCoefficient = (
   waterType: WaterType,
   tariff: TariffSnapshot,
): number =>
   waterType === 'OUTDOOR'
      ? tariff.street_line_coefficient
      : tariff.indoor_line_coefficient

export const resolvePricePerM3 = (
   tariff: TariffSnapshot,
   fallbackPricePerM3 = 0,
): number => tariff.price_per_m3 ?? fallbackPricePerM3

export const resolveTariffForDate = async (
   type: TariffType,
   effectiveDate: Date,
   explicitTariffId?: Types.ObjectId | string | null,
) => {
   if (explicitTariffId) {
      const explicitTariff = await TariffModel.findById(explicitTariffId).lean()

      if (explicitTariff) {
         return explicitTariff
      }
   }

   return TariffModel.findOne({
      type,
      effective_date: { $lte: effectiveDate },
   })
      .sort({ effective_date: -1, created_at: -1 })
      .lean()
}

/**
 * Berilgan type bo'yicha hozirgi amaldagi tarifni qaytaradi
 */
export const getCurrentTariff = async (type: TariffType) =>
   resolveTariffForDate(type, new Date())

/**
 * Berilgan type bo'yicha PENDING tarifni qaytaradi (agar mavjud bo'lsa)
 */
export const getPendingTariff = async (type: TariffType) =>
   TariffModel.findOne({ type, status: 'PENDING' }).lean()

/**
 * TZ fix: hisoblagichli va hisoblagichsiz formulalar alohida ishlaydi.
 * Hisoblagichli: m3 * 1m3 narxi
 * Hisoblagichsiz: odamlar soni * suv turi koeffitsienti * oylik tarif
 */
export const calculateWaterBill = ({
   billingMode,
   waterType,
   tariff,
   consumptionM3 = 0,
   familyMembers = 1,
   fallbackPricePerM3 = 0,
}: CalculateWaterBillInput): number => {
   if (billingMode === 'METERED') {
      return consumptionM3 * resolvePricePerM3(tariff, fallbackPricePerM3)
   }

   const normalizedFamilyMembers = familyMembers > 0 ? familyMembers : 1
   const lineCoefficient = resolveLineCoefficient(waterType, tariff)

   return normalizedFamilyMembers * lineCoefficient * tariff.monthly_rate
}
// CHANGE END: tarif helperlari va billing formulasi TZga mos qayta yozildi.

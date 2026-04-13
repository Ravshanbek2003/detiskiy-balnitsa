// CHANGE START: monthly billing helperi TZga mos qayta ishlangan.
import {
   AuditAction,
   AuditActorRole,
   AuditLogModel,
   MonthlyReportModel,
   SubscriberModel,
   SubscriberStatus,
   TariffModel,
   WaterMeterModel,
   WaterPricingModel,
} from '../models'
import { calculateWaterBill, resolveTariffForDate, resolveTariffType } from './tariff.helper'

const getMonthString = (date: Date): string => {
   const year = date.getFullYear()
   const month = String(date.getMonth() + 1).padStart(2, '0')

   return `${year}-${month}`
}

const getMonthStartFromDate = (date: Date): Date =>
   new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1))

const getMonthStartFromString = (month: string): Date => {
   const [year, monthIndex] = month.split('-').map(Number)

   return new Date(Date.UTC(year, monthIndex - 1, 1))
}

const toKey = (value: unknown): string => String(value)

const resolveDefaultTariffs = async (effectiveDate: Date) => {
   const [individualTariff, legalEntityTariff] = await Promise.all([
      resolveTariffForDate('JISMONIY', effectiveDate),
      resolveTariffForDate('YURIDIK', effectiveDate),
   ])

   return {
      INDIVIDUAL: individualTariff,
      LEGAL_ENTITY: legalEntityTariff,
   }
}

/**
 * Oyning 1-sanasida: Barcha faol abonentlar uchun oylik hisobot yaratish
 * previousReading va currentReading boshlang'ich qiymat bilan yoziladi
 * Hisob-kitob 25-sanada yangilanadi
 */
export const createMonthlyReports = async (): Promise<void> => {
   const now = new Date()
   const month = getMonthString(now)
   const monthStart = getMonthStartFromDate(now)

   const subscribers = await SubscriberModel.find({
      status: { $in: [SubscriberStatus.ACTIVE, SubscriberStatus.DEBTOR] },
   })
      .lean()
      .exec()

   if (subscribers.length === 0) {
      console.info(
         `[MonthlyReport Cron] Faol abonentlar topilmadi. ${now.toISOString()}`,
      )
      return
   }

   const [existingReports, defaultTariffs] = await Promise.all([
      MonthlyReportModel.find({ month }).select('subscriber_id').lean().exec(),
      resolveDefaultTariffs(monthStart),
   ])

   const existingSubscriberIds = new Set(
      existingReports.map(report => toKey(report.subscriber_id)),
   )

   const waterMeterIds = subscribers
      .map(subscriber => subscriber.water_meter_id)
      .filter(Boolean)

   const explicitTariffIds = subscribers
      .map(subscriber => subscriber.tariff_id)
      .filter(Boolean)

   const [waterMeters, explicitTariffs] = await Promise.all([
      waterMeterIds.length > 0
         ? WaterMeterModel.find({ _id: { $in: waterMeterIds } }).lean().exec()
         : [],
      explicitTariffIds.length > 0
         ? TariffModel.find({ _id: { $in: explicitTariffIds } }).lean().exec()
         : [],
   ])

   const waterMeterMap = new Map(waterMeters.map(meter => [toKey(meter._id), meter]))
   const explicitTariffMap = new Map(
      explicitTariffs.map(tariff => [toKey(tariff._id), tariff]),
   )

   const reports = []

   for (const subscriber of subscribers) {
      if (existingSubscriberIds.has(toKey(subscriber._id))) {
         continue
      }

      const defaultTariff = defaultTariffs[subscriber.type]
      const tariff =
         (subscriber.tariff_id
            ? explicitTariffMap.get(toKey(subscriber.tariff_id))
            : null) ?? defaultTariff

      if (!tariff) {
         continue
      }

      let previousReading = 0
      let currentReading = 0

      if (subscriber.is_water_meter && subscriber.water_meter_id) {
         const waterMeter = waterMeterMap.get(toKey(subscriber.water_meter_id))

         if (waterMeter) {
            previousReading = waterMeter.last_reading
            currentReading = waterMeter.last_reading
         }
      }

      reports.push({
         subscriber_id: subscriber._id,
         // TZ fix: report ichiga aynan shu oyda amal qilgan tarif versiyasi yoziladi.
         tariff_id: tariff._id,
         has_water_meter: subscriber.is_water_meter,
         month,
         previousReading,
         currentReading,
         waterUsed: 0,
         amountCalculated: 0,
         amountPaid: 0,
         balanceApplied: 0,
         monthlyDebt: 0,
      })
   }

   if (reports.length > 0) {
      await MonthlyReportModel.insertMany(reports)
   }

   console.info(
      `[MonthlyReport Cron] ${reports.length} ta oylik hisobot yaratildi. Oy: ${month}. Sana: ${now.toISOString()}`,
   )
}

/**
 * Oyning 25-sanasida: Hisob-kitobni yangilash
 * - Hisoblagichli abonentlar: waterMeter.last_reading dan waterUsed hisoblanadi
 * - Hisoblagichsiz abonentlar: tarif bo'yicha monthly_rate hisoblanadi
 * - amountCalculated, zaxira balans va monthlyDebt yangilanadi
 */
export const updateMonthlyReports = async (): Promise<void> => {
   const now = new Date()
   const month = getMonthString(now)
   const monthStart = getMonthStartFromString(month)

   const reports = await MonthlyReportModel.find({ month }).lean().exec()

   if (reports.length === 0) {
      console.info(
         `[MonthlyReport Cron] Bu oy uchun hisobotlar topilmadi. ${now.toISOString()}`,
      )
      return
   }

   const subscriberIds = reports.map(report => report.subscriber_id)
   const subscribers = await SubscriberModel.find({ _id: { $in: subscriberIds } })
      .lean()
      .exec()

   const subscriberMap = new Map(
      subscribers.map(subscriber => [toKey(subscriber._id), subscriber]),
   )

   const waterMeterIds = subscribers
      .map(subscriber => subscriber.water_meter_id)
      .filter(Boolean)
   const reportTariffIds = reports.map(report => report.tariff_id).filter(Boolean)

   const [activeWaterPricing, waterMeters, reportTariffs, defaultTariffs] =
      await Promise.all([
         WaterPricingModel.findOne({ isActive: true }).lean().exec(),
         waterMeterIds.length > 0
            ? WaterMeterModel.find({ _id: { $in: waterMeterIds } }).lean().exec()
            : [],
         reportTariffIds.length > 0
            ? TariffModel.find({ _id: { $in: reportTariffIds } }).lean().exec()
            : [],
         resolveDefaultTariffs(monthStart),
      ])

   const waterMeterMap = new Map(waterMeters.map(meter => [toKey(meter._id), meter]))
   const reportTariffMap = new Map(
      reportTariffs.map(tariff => [toKey(tariff._id), tariff]),
   )

   const reportOperations = []
   const subscriberOperations = []
   let updatedCount = 0

   for (const report of reports) {
      const subscriber = subscriberMap.get(toKey(report.subscriber_id))

      if (!subscriber) {
         continue
      }

      if (
         subscriber.status === SubscriberStatus.FROZEN ||
         subscriber.status === SubscriberStatus.DELETED
      ) {
         continue
      }

      const tariff =
         reportTariffMap.get(toKey(report.tariff_id)) ??
         defaultTariffs[subscriber.type]

      if (!tariff) {
         continue
      }

      let currentReading = report.previousReading
      let waterUsed = 0

      if (subscriber.is_water_meter && subscriber.water_meter_id) {
         const waterMeter = waterMeterMap.get(toKey(subscriber.water_meter_id))

         if (waterMeter) {
            currentReading = waterMeter.last_reading
            waterUsed = Math.max(currentReading - report.previousReading, 0)
         }
      }

      // TZ fix: hisoblagichli va hisoblagichsiz abonentlar formulasi alohida qo'llanadi.
      const amountCalculated = subscriber.is_water_meter
         ? calculateWaterBill({
              billingMode: 'METERED',
              waterType: subscriber.water_type,
              tariff,
              consumptionM3: waterUsed,
              fallbackPricePerM3: activeWaterPricing?.pricePerM3 ?? 0,
           })
         : calculateWaterBill({
              billingMode: 'FIXED',
              waterType: subscriber.water_type,
              tariff,
              familyMembers:
                 subscriber.type === 'INDIVIDUAL'
                    ? subscriber.family_members ?? 1
                    : 1,
           })

      const previousBalanceApplied = report.balanceApplied ?? 0
      const payableBeforeBalance = Math.max(
         amountCalculated - report.amountPaid,
         0,
      )
      const availableBalance = Math.max(
         subscriber.balance + previousBalanceApplied,
         0,
      )
      const balanceApplied = Math.min(availableBalance, payableBeforeBalance)
      const monthlyDebt = payableBeforeBalance - balanceApplied
      const nextBalance = availableBalance - balanceApplied
      const debtDelta = monthlyDebt - report.monthlyDebt
      const nextRealDebt = Math.max(subscriber.real_debt + debtDelta, 0)

      reportOperations.push({
         updateOne: {
            filter: { _id: report._id },
            update: {
               $set: {
                  currentReading,
                  waterUsed,
                  amountCalculated,
                  balanceApplied,
                  monthlyDebt,
               },
            },
         },
      })

      subscriberOperations.push({
         updateOne: {
            filter: { _id: subscriber._id },
            update: {
               $set: {
                  balance: nextBalance,
                  real_debt: nextRealDebt,
               },
            },
         },
      })

      updatedCount++
   }

   if (reportOperations.length > 0) {
      await MonthlyReportModel.bulkWrite(reportOperations)
   }

   if (subscriberOperations.length > 0) {
      await SubscriberModel.bulkWrite(subscriberOperations)
   }

   // TZ fix: billing cycle audit logi avtomatik yoziladi.
   await AuditLogModel.create({
      action: AuditAction.BILLING_CYCLE_RUN,
      actor_role: AuditActorRole.SYSTEM,
      actor_name: 'SYSTEM',
      changes: {
         started_at: monthStart,
         finished_at: new Date(),
         subscribers_count: updatedCount,
      },
   }).catch(() => {})

   console.info(
      `[MonthlyReport Cron] ${updatedCount} ta hisobot yangilandi. Oy: ${month}. Sana: ${now.toISOString()}`,
   )
}
// CHANGE END: monthly billing helperi TZga mos qayta ishlangan.

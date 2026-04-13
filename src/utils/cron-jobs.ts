import cron from 'node-cron'

import { UploadController } from '../controllers'
import { WorkerModel } from '../models/worker/worker.model'

export function CronJobs() {
   cron.schedule('59 23 * * *', () => {
      UploadController.deleteFileWithCron()
         .then(deletedFiles => {
            console.info(
               `${deletedFiles} file(s) deleted in uploads storage. Date: ${new Date().toString()}`,
            )
         })
         .catch(error => {
            console.error('Error deleting files:', error)
         })
   })

   cron.schedule('0 0 * * *', async () => {
      try {
         const result = await WorkerModel.updateMany(
            {},
            { $set: { today_patients_count: 0 } },
         )
         console.info(
            `Reset today_patients_count for ${result.modifiedCount} workers. Date: ${new Date().toString()}`,
         )
      } catch (error) {
         console.error('Error resetting today_patients_count:', error)
      }
   })
}

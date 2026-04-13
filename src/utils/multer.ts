import fs from 'fs'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import multer from 'multer'
import path from 'path'
import { v4 } from 'uuid'

import { HttpException } from './http.exception'

const checkFileType = (
   file: Express.Multer.File,
   cb: multer.FileFilterCallback,
) => {
   // Allowed file extensions
   const filetypes =
      /\.(jpeg|png|jpg|avif|webp|pdf|doc|docx|xls|xlsx|ppt|pptx|rtf|mdfx)$/i
   const extname = filetypes.test(
      path.extname(file.originalname)?.toLowerCase(),
   )

   // Allowed MIME types
   const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/avif',
      'image/webp',
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'application/rtf', // .rtf
      'text/rtf', // .rtf
   ]

   const mimetype = allowedMimeTypes.includes(file.mimetype)

   // .mdfx (EEG medical data) files have non-standard MIME type (application/octet-stream)
   // so we allow them based on extension only
   const isMdfx = path.extname(file.originalname)?.toLowerCase() === '.mdfx'

   if ((mimetype || isMdfx) && extname) {
      cb(null, true)
   } else {
      const error = new HttpException(
         StatusCodes.UNPROCESSABLE_ENTITY,
         ReasonPhrases.UNPROCESSABLE_ENTITY,
         'Ruxsat berilgan fayllar: rasm (JPG, PNG, WEBP), PDF, Word, Excel, PowerPoint, RTF. Maksimal hajm: 50 MB',
      )
      cb(error as any)
   }
}

export const upload = multer({
   storage: multer.memoryStorage(),
   limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
   fileFilter: (req, file, cb) => {
      checkFileType(file, cb)
   },
})

// Video upload configuration - uses disk storage to prevent RAM overload
const videoUploadsDir = path.join(process.cwd(), 'uploads', 'video')
console.log('[Multer] Video uploads directory:', videoUploadsDir)

// Ensure video uploads directory exists
if (!fs.existsSync(videoUploadsDir)) {
   console.log('[Multer] Creating video uploads directory')
   fs.mkdirSync(videoUploadsDir, { recursive: true })
}

const videoStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      console.log('[Multer VideoStorage] Destination:', videoUploadsDir)
      // Ensure directory exists on each request (in case it was deleted)
      if (!fs.existsSync(videoUploadsDir)) {
         fs.mkdirSync(videoUploadsDir, { recursive: true })
      }
      cb(null, videoUploadsDir)
   },
   filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase()
      const filename = `${v4()}${ext}`
      console.log('[Multer VideoStorage] Filename:', filename)
      cb(null, filename)
   },
})

const checkVideoType = (
   file: Express.Multer.File,
   cb: multer.FileFilterCallback,
) => {
   // Allowed video extensions
   const videoExtensions = /\.(mp4|mov|webm|avi|mkv)$/i
   const extname = videoExtensions.test(
      path.extname(file.originalname)?.toLowerCase(),
   )

   // Allowed video MIME types
   const allowedVideoMimeTypes = [
      'video/mp4',
      'video/quicktime', // .mov
      'video/webm',
      'video/x-msvideo', // .avi
      'video/x-matroska', // .mkv
   ]

   const mimetype = allowedVideoMimeTypes.includes(file.mimetype)

   if (mimetype && extname) {
      cb(null, true)
   } else {
      const error = new HttpException(
         StatusCodes.UNPROCESSABLE_ENTITY,
         ReasonPhrases.UNPROCESSABLE_ENTITY,
         'Ruxsat berilgan video formatlar: MP4, MOV, WEBM, AVI, MKV. Maksimal hajm: 100 MB',
      )
      cb(error as any)
   }
}

export const uploadVideo = multer({
   storage: videoStorage, // Disk storage - doesn't load into RAM
   limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB per video
   fileFilter: (req, file, cb) => {
      checkVideoType(file, cb)
   },
})

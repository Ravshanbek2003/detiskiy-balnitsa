import { exec } from 'child_process'
import fs from 'fs'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import path from 'path'
import sharp from 'sharp'
import { v4 } from 'uuid'

import { ErrorMessages } from '../../constants'
import { UploadModel } from '../../models'
import {
   HttpException,
   asyncHandler,
   deleteFile,
   uploadFile,
} from '../../utils'

export class UploadController {
   // Allowed document types (excluding PDF - handled separately with compression)
   private static readonly allowedDocTypes = [
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/rtf', // .rtf
      'text/rtf', // .rtf
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
   ]

   private static readonly allowedDocExtensions = [
      'mdfx',
      'rtf',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
   ]

   private static readonly uploadsDir = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'uploads',
   )

   public static uploadFile = asyncHandler(async (req, res) => {
      console.log('[Upload] Request received:', {
         hasFile: !!req.file,
         hasFiles: !!req.files,
         bodyKeys: Object.keys(req.body),
         contentType: req.headers['content-type'],
      })

      const uploadedFile = req.file
      if (!uploadedFile) {
         console.error('[Upload] No file in request')
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            ErrorMessages.NO_FILE_UPLOADED,
         )
      }

      console.log('[Upload] File received:', {
         name: uploadedFile.originalname,
         mimetype: uploadedFile.mimetype,
         size: uploadedFile.size,
      })

      let processedBuffer: Buffer | undefined
      let fileKey: string | undefined
      const fileExtension = path
         .extname(uploadedFile.originalname)
         .replace('.', '')
         .toLowerCase()

      try {
         // Handle images
         if (uploadedFile.mimetype.split('/')[0] === 'image') {
            console.log('[Upload] Processing image')
            processedBuffer = await sharp(uploadedFile.buffer)
               .rotate()
               .toFormat('webp')
               .toBuffer()
            fileKey = 'image/' + v4() + '.webp'
            console.log('[Upload] Image processed:', fileKey)
         }
         // Handle PDF with compression
         else if (uploadedFile.mimetype === 'application/pdf') {
            // Try to compress PDF using Ghostscript if available
            // To install: sudo apt install ghostscript
            if (!fs.existsSync(UploadController.uploadsDir)) {
               fs.mkdirSync(UploadController.uploadsDir, { recursive: true })
            }

            const fileId = v4()
            const inputPath = path.join(
               UploadController.uploadsDir,
               `${fileId}-input.pdf`,
            )
            const outputPath = path.join(
               UploadController.uploadsDir,
               `${fileId}-output.pdf`,
            )

            fs.writeFileSync(inputPath, uploadedFile.buffer)

            const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`

            try {
               await new Promise<void>((resolve, reject) => {
                  exec(gsCommand, error => {
                     if (error) {
                        // If Ghostscript is not installed, skip compression
                        if (
                           error.message.includes('not found') ||
                           error.message.includes('command not found')
                        ) {
                           console.warn(
                              'Ghostscript not found. Uploading PDF without compression.',
                           )
                           resolve()
                        } else {
                           console.error('Error compressing PDF:', error)
                           reject(error)
                        }
                        return
                     }

                     try {
                        processedBuffer = fs.readFileSync(outputPath)
                        fs.unlinkSync(inputPath)
                        fs.unlinkSync(outputPath)
                        fileKey = 'document/' + v4() + '.pdf'
                        resolve()
                     } catch (err) {
                        reject(err)
                     }
                  })
               })

               // If compression failed or Ghostscript not available, use original file
               if (!processedBuffer) {
                  processedBuffer = uploadedFile.buffer
                  fileKey = 'document/' + v4() + '.pdf'
               }
            } catch (error) {
               console.error('PDF processing error:', error)
               // Fallback to original PDF
               processedBuffer = uploadedFile.buffer
               fileKey = 'document/' + v4() + '.pdf'
            } finally {
               // Clean up temporary files
               if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
               if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
            }
         }
         // Handle other document types (Word, Excel, RTF, etc.)
         else if (
            UploadController.allowedDocTypes.includes(uploadedFile.mimetype) ||
            UploadController.allowedDocExtensions.includes(fileExtension)
         ) {
            processedBuffer = uploadedFile.buffer
            fileKey = `document/${v4()}.${fileExtension}`
         }

         if (!fileKey || !processedBuffer) {
            console.error('[Upload] Invalid file type:', {
               mimetype: uploadedFile.mimetype,
               extension: fileExtension,
               hasKey: !!fileKey,
               hasBuffer: !!processedBuffer,
            })
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               "Fayl turi qo'llab-quvvatlanmaydi. Faqat rasm, PDF, Word, Excel, PowerPoint va RTF fayllarga ruxsat",
            )
         }

         console.log('[Upload] Uploading to storage:', fileKey)
         const file_path = await uploadFile(processedBuffer, fileKey)
         console.log('[Upload] Storage result:', file_path)

         if (!file_path) {
            console.error('[Upload] Storage upload failed')
            throw new HttpException(
               StatusCodes.INTERNAL_SERVER_ERROR,
               ReasonPhrases.INTERNAL_SERVER_ERROR,
               'Fayl serverga yuklanmadi',
            )
         }

         console.log('[Upload] Saving to database:', file_path)
         await UploadModel.create({ file_path, user: req.user?._id })

         console.log('[Upload] Success')
         res.status(StatusCodes.CREATED).json({
            success: true,
            file_path,
         })
      } catch (error) {
         console.error('[Upload] ERROR:', {
            message: error instanceof Error ? error.message : 'Unknown',
            stack: error instanceof Error ? error.stack : undefined,
            error,
         })
         throw new HttpException(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ReasonPhrases.INTERNAL_SERVER_ERROR,
            error instanceof Error ? error.message : 'Fayl yuklashda xatolik',
         )
      }
   })

   public static uploadFiles = asyncHandler(async (req, res) => {
      const uploadedFiles = req.files as Express.Multer.File[]
      if (!uploadedFiles || uploadedFiles.length === 0) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'Fayllar yuklanmadi',
         )
      }

      const fileResults = await Promise.all(
         uploadedFiles.map(async uploadedFile => {
            try {
               let processedBuffer: Buffer | undefined
               let fileKey: string | undefined
               const fileExtension = path
                  .extname(uploadedFile.originalname)
                  .replace('.', '')
                  .toLowerCase()

               // Handle images
               if (uploadedFile.mimetype.split('/')[0] === 'image') {
                  processedBuffer = await sharp(uploadedFile.buffer)
                     .rotate()
                     .toFormat('webp')
                     .toBuffer()
                  fileKey = 'image/' + v4() + '.webp'
               }
               // Handle PDF with compression
               else if (uploadedFile.mimetype === 'application/pdf') {
                  if (!fs.existsSync(UploadController.uploadsDir)) {
                     fs.mkdirSync(UploadController.uploadsDir, {
                        recursive: true,
                     })
                  }

                  const fileId = v4()
                  const inputPath = path.join(
                     UploadController.uploadsDir,
                     `${fileId}-input.pdf`,
                  )
                  const outputPath = path.join(
                     UploadController.uploadsDir,
                     `${fileId}-output.pdf`,
                  )

                  fs.writeFileSync(inputPath, uploadedFile.buffer)

                  const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`

                  await new Promise<void>((resolve, reject) => {
                     exec(gsCommand, error => {
                        if (error) {
                           console.error('Error compressing PDF:', error)
                           // Clean up files on error
                           if (fs.existsSync(inputPath))
                              fs.unlinkSync(inputPath)
                           if (fs.existsSync(outputPath))
                              fs.unlinkSync(outputPath)
                           reject(error)
                           return
                        }

                        try {
                           processedBuffer = fs.readFileSync(outputPath)
                           fs.unlinkSync(inputPath)
                           fs.unlinkSync(outputPath)
                           fileKey = 'document/' + v4() + '.pdf'
                           resolve()
                        } catch (err) {
                           reject(err)
                        }
                     })
                  })
               }
               // Handle other document types (Word, Excel, RTF, etc.)
               else if (
                  UploadController.allowedDocTypes.includes(
                     uploadedFile.mimetype,
                  ) ||
                  UploadController.allowedDocExtensions.includes(fileExtension)
               ) {
                  processedBuffer = uploadedFile.buffer
                  fileKey = `document/${v4()}.${fileExtension}`
               }

               if (!fileKey || !processedBuffer) {
                  console.warn(
                     `Unsupported file type: ${uploadedFile.mimetype}`,
                  )
                  return null
               }

               const file_path = await uploadFile(processedBuffer, fileKey)
               if (!file_path) {
                  return null
               }

               return { file_path, user: req.user?._id }
            } catch (error) {
               console.error('Error processing file:', error)
               return null
            }
         }),
      )

      const filteredResults = fileResults.filter(Boolean) as Array<{
         file_path: string
         user: any
      }>

      if (filteredResults.length === 0) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'Hech qanday fayl yuklanmadi. Faqat rasm, PDF, Word, Excel, PowerPoint va RTF fayllarga ruxsat',
         )
      }

      // Bulk insert for better performance
      await UploadModel.insertMany(filteredResults)

      res.status(StatusCodes.CREATED).json({
         success: true,
         file_paths: filteredResults.map(r => r.file_path),
      })
   })

   public static deleteFileWithCron = async (): Promise<string> => {
      try {
         const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
         const files = (
            await UploadModel.find(
               { is_use: false, created_at: { $lt: oneDayAgo } },
               null,
               { lean: true },
            )
         ).map(item => item.file_path)
         for (const item of files) {
            void deleteFile(item)
            await UploadModel.deleteOne({ file_path: item })
         }

         return files.length.toString()
      } catch (error) {
         console.error(error)
         return 'Not'
      }
   }

   // Video upload - uses disk storage to prevent RAM overload
   public static uploadVideoFile = asyncHandler(async (req, res) => {
      console.log('[VideoUpload] Request received:', {
         hasFile: !!req.file,
         hasFiles: !!req.files,
         bodyKeys: Object.keys(req.body),
         contentType: req.headers['content-type'],
         fileFieldName: req.file?.fieldname,
         fileName: req.file?.filename,
         originalName: req.file?.originalname,
         path: req.file?.path,
      })

      const uploadedFile = req.file
      if (!uploadedFile) {
         console.error(
            '[VideoUpload] No file in request - check that form field name is "video"',
         )
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            ErrorMessages.NO_FILE_UPLOADED,
         )
      }

      // File is already saved to disk by multer diskStorage
      const BASE_URL = process.env.BASE_URL || 'http://localhost:8080'
      const file_path = `${BASE_URL}/uploads/video/${uploadedFile.filename}`

      console.log('[VideoUpload] Saving to database:', file_path)
      await UploadModel.create({ file_path, user: req.user?._id })

      console.log('[VideoUpload] Success:', file_path)
      res.status(StatusCodes.CREATED).json({
         success: true,
         file_path,
      })
   })

   // Multiple video upload
   public static uploadVideoFiles = asyncHandler(async (req, res) => {
      console.log('[VideoUpload Multiple] Request received:', {
         hasFile: !!req.file,
         hasFiles: !!req.files,
         filesCount: Array.isArray(req.files) ? req.files.length : 0,
         bodyKeys: Object.keys(req.body),
         contentType: req.headers['content-type'],
      })

      const uploadedFiles = req.files as Express.Multer.File[]
      if (!uploadedFiles || uploadedFiles.length === 0) {
         console.error(
            '[VideoUpload Multiple] No files in request - check that form field name is "videos"',
         )
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            ErrorMessages.NO_FILE_UPLOADED,
         )
      }

      const BASE_URL = process.env.BASE_URL || 'http://localhost:8080'
      const results = uploadedFiles.map(file => ({
         file_path: `${BASE_URL}/uploads/video/${file.filename}`,
         user: req.user?._id,
      }))

      console.log(
         '[VideoUpload Multiple] Saving to database:',
         results.map(r => r.file_path),
      )
      await UploadModel.insertMany(results)

      console.log('[VideoUpload Multiple] Success')
      res.status(StatusCodes.CREATED).json({
         success: true,
         file_paths: results.map(r => r.file_path),
      })
   })
}

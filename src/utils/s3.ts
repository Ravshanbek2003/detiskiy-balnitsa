import fs from 'fs'
import { promises as fsPromises } from 'fs'
import path from 'path'

// Local file storage setup - use process.cwd() for consistent path
const UPLOADS_DIR = path.join(process.cwd(), 'uploads')
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080'

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
   fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

const uploadFile = async (
   buffer: Buffer,
   key: string,
): Promise<string | undefined> => {
   try {
      console.log('[S3] Upload started:', {
         key,
         bufferSize: buffer?.length,
         uploadsDir: UPLOADS_DIR,
         baseUrl: BASE_URL,
      })

      // Create subdirectories if needed (e.g., image/, document/)
      const filePath = path.join(UPLOADS_DIR, key)
      const fileDir = path.dirname(filePath)

      if (!fs.existsSync(fileDir)) {
         console.log('[S3] Creating directory:', fileDir)
         fs.mkdirSync(fileDir, { recursive: true })
      }

      // Write file to disk asynchronously
      await fsPromises.writeFile(filePath, buffer)
      console.log('[S3] File written to:', filePath)

      // Return the public URL
      const fileUrl = `${BASE_URL}/uploads/${key}`
      console.log('[S3] Returning URL:', fileUrl)
      return fileUrl
   } catch (error) {
      console.error('[S3] Upload failed:', {
         error: error instanceof Error ? error.message : 'Unknown',
         stack: error instanceof Error ? error.stack : undefined,
      })
      throw error // Throw error to be handled by controller
   }
}

const deleteFile = async (location: string): Promise<void> => {
   try {
      if (location) {
         // Extract file path from URL
         const key = location.split('/uploads/')[1]
         if (key) {
            const filePath = path.join(UPLOADS_DIR, key)
            if (fs.existsSync(filePath)) {
               await fsPromises.unlink(filePath)
            }
         }
      }
   } catch (error) {
      console.error('Error deleting file:', error)
      throw error
   }
}

const checkFileExists = async (location: string): Promise<boolean> => {
   try {
      if (location) {
         const key = location.split('/uploads/')[1]
         if (key) {
            const filePath = path.join(UPLOADS_DIR, key)
            return fs.existsSync(filePath)
         }
      }
      return false
   } catch (error) {
      console.error('Error checking file existence:', error)
      throw error
   }
}

export { uploadFile, deleteFile, checkFileExists }

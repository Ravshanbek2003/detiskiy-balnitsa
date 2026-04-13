import { Router } from 'express'

import { getEndpointRoles } from '../../constants'
import { UploadController } from '../../controllers'
import {
   authMiddleware,
   roleMiddleware,
   upload,
   uploadVideo,
} from '../../utils'

const uploadRouter = Router()

uploadRouter.post(
   '/file',
   authMiddleware,
   roleMiddleware(getEndpointRoles('upload', '/file', 'POST')),
   upload.single('file'),
   UploadController.uploadFile,
)

uploadRouter.post(
   '/files',
   authMiddleware,
   roleMiddleware(getEndpointRoles('upload', '/files', 'POST')),
   upload.array('files', 10),
   UploadController.uploadFiles,
)

// Video upload endpoints - uses disk storage to prevent server freeze
uploadRouter.post(
   '/video',
   authMiddleware,
   roleMiddleware(getEndpointRoles('upload', '/video', 'POST')),
   uploadVideo.single('video'),
   UploadController.uploadVideoFile,
)

uploadRouter.post(
   '/videos',
   authMiddleware,
   roleMiddleware(getEndpointRoles('upload', '/videos', 'POST')),
   uploadVideo.array('videos', 10), // Max 10 videos at once
   UploadController.uploadVideoFiles,
)

export { uploadRouter }

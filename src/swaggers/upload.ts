import { SwaggerExamples } from './examples'

const UploadSwagger = {
   endpoint: 'upload',
   paths: [
      {
         path: 'file',
         body: {
            post: {
               tags: ['Upload'],
               summary: 'Upload a single file — Allowed: Authenticated users',
               requestBody: {
                  required: true,
                  content: {
                     'multipart/form-data': {
                        schema: {
                           type: 'object',
                           properties: {
                              file: {
                                 type: 'string',
                                 format: 'binary',
                              },
                           },
                           required: ['file'],
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: 'File uploaded successfully',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.upload.file_success,
                        },
                     },
                  },
                  '400': {
                     description: 'No file uploaded or invalid file',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.errors.validation_error,
                        },
                     },
                  },
                  '413': {
                     description: 'File size exceeded',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.upload.error_file_too_large,
                        },
                     },
                  },
               },
            },
         },
      },
      {
         path: 'files',
         body: {
            post: {
               tags: ['Upload'],
               summary: 'Upload multiple files — Allowed: Authenticated users',
               requestBody: {
                  required: true,
                  content: {
                     'multipart/form-data': {
                        schema: {
                           type: 'object',
                           properties: {
                              files: {
                                 type: 'array',
                                 items: { type: 'string', format: 'binary' },
                              },
                           },
                           required: ['files'],
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: 'Files uploaded successfully',
                     content: {
                        'application/json': {
                           example: {
                              success: true,
                              urls: ['/uploads/a.jpg', '/uploads/b.jpg'],
                           },
                        },
                     },
                  },
                  '400': {
                     description: 'No files uploaded',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.errors.validation_error,
                        },
                     },
                  },
               },
            },
         },
      },
      {
         path: 'video',
         body: {
            post: {
               tags: ['Upload'],
               summary:
                  'Upload a single video file (MP4, MOV, WEBM, AVI, MKV) — Max 100MB',
               security: [{ bearerAuth: [] }],
               requestBody: {
                  required: true,
                  content: {
                     'multipart/form-data': {
                        schema: {
                           type: 'object',
                           properties: {
                              video: {
                                 type: 'string',
                                 format: 'binary',
                                 description:
                                    'Video file (MP4, MOV, WEBM, AVI, MKV)',
                              },
                           },
                           required: ['video'],
                        },
                     },
                  },
               },
               responses: {
                  '201': {
                     description: 'Video uploaded successfully',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.upload.video_success,
                        },
                     },
                  },
                  '400': {
                     description: 'No file uploaded',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.errors.validation_error,
                        },
                     },
                  },
                  '413': {
                     description: 'File size exceeded (max 100MB)',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.upload.error_file_too_large,
                        },
                     },
                  },
                  '422': {
                     description: 'Invalid file type',
                     content: {
                        'application/json': {
                           example: {
                              success: false,
                              error: {
                                 statusCode: 422,
                                 statusMsg: 'UNPROCESSABLE_ENTITY',
                                 msg: 'Invalid file type. Allowed: MP4, MOV, WEBM, AVI, MKV',
                              },
                           },
                        },
                     },
                  },
               },
            },
         },
      },
      {
         path: 'videos',
         body: {
            post: {
               tags: ['Upload'],
               summary: 'Upload multiple video files (max 10) — Max 100MB each',
               security: [{ bearerAuth: [] }],
               requestBody: {
                  required: true,
                  content: {
                     'multipart/form-data': {
                        schema: {
                           type: 'object',
                           properties: {
                              videos: {
                                 type: 'array',
                                 items: { type: 'string', format: 'binary' },
                                 description:
                                    'Video files (MP4, MOV, WEBM, AVI, MKV)',
                              },
                           },
                           required: ['videos'],
                        },
                     },
                  },
               },
               responses: {
                  '201': {
                     description: 'Videos uploaded successfully',
                     content: {
                        'application/json': {
                           example: {
                              success: true,
                              file_paths: [
                                 'video/abc123.mp4',
                                 'video/def456.mp4',
                              ],
                           },
                        },
                     },
                  },
                  '400': {
                     description: 'No files uploaded',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.errors.validation_error,
                        },
                     },
                  },
                  '413': {
                     description: 'File size exceeded (max 100MB each)',
                     content: {
                        'application/json': {
                           example: SwaggerExamples.upload.error_file_too_large,
                        },
                     },
                  },
                  '422': {
                     description:
                        'Invalid file type or too many files (max 10)',
                     content: {
                        'application/json': {
                           example: {
                              success: false,
                              error: {
                                 statusCode: 422,
                                 statusMsg: 'UNPROCESSABLE_ENTITY',
                                 msg: 'Max 10 videos allowed',
                              },
                           },
                        },
                     },
                  },
               },
            },
         },
      },
   ],
}

export { UploadSwagger }

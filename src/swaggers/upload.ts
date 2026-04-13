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
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 url: {
                                    type: 'string',
                                    example: '/uploads/abc.jpg',
                                 },
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
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 urls: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: [
                                       '/uploads/a.jpg',
                                       '/uploads/b.jpg',
                                    ],
                                 },
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
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 file_path: {
                                    type: 'string',
                                    example: 'video/abc123.mp4',
                                 },
                              },
                           },
                        },
                     },
                  },
                  '400': { description: 'No file uploaded' },
                  '422': { description: 'Invalid file type or size exceeded' },
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
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 file_paths: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: [
                                       'video/abc123.mp4',
                                       'video/def456.mp4',
                                    ],
                                 },
                              },
                           },
                        },
                     },
                  },
                  '400': { description: 'No files uploaded' },
                  '422': { description: 'Invalid file type or size exceeded' },
               },
            },
         },
      },
   ],
}

export { UploadSwagger }

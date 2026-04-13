import cors from 'cors'
import fs from 'fs'
import helmet from 'helmet'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import path from 'path'
import swaggerUi from 'swagger-ui-express'

import express, { Application, Request, Response, Router } from 'express'

import { Routes } from './routes'
import { Swagger } from './swaggers'
import {
   CONNECT_DB,
   HttpException,
   IP,
   errorMiddleware,
   noAsyncHandler,
} from './utils'

export class App {
   public app: Application

   public constructor() {
      this.app = express()

      void CONNECT_DB()

      this.initializeConfig()
      this.initializeDocumentation()
      this.initializeControllers()
      this.initializeErrorHandling()
   }

   private initializeConfig(): void {
      this.app.set('trust proxy', IP ? `loopback, ${IP}` : 'loopback')

      // CORS - eng birinchi bo'lishi kerak
      this.app.use(
         cors({
            origin: function (origin, callback) {
               // Origin yo'q bo'lsa (Postman, cURL) yoki har qanday origin
               callback(null, true)
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: [
               'Content-Type',
               'Authorization',
               'X-Requested-With',
               'Accept',
               'Origin',
            ],
            exposedHeaders: ['Content-Range', 'X-Content-Range'],
            maxAge: 86400,
         }),
      )

      this.app.use(express.json())
      this.app.use(express.urlencoded({ extended: true }))

      this.app.use(
         helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: { policy: 'cross-origin' },
         }),
      )

      const publicDir = path.join(__dirname, 'public')
      this.app.use('/public', express.static(publicDir))

      // Static file serving for uploads - use process.cwd() for consistent path
      const uploadsDir = path.join(process.cwd(), 'uploads')
      console.log('[Static] Uploads directory:', uploadsDir)

      // Ensure uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
         fs.mkdirSync(uploadsDir, { recursive: true })
      }

      // Serve uploads with proper headers for video streaming
      this.app.use(
         '/uploads',
         express.static(uploadsDir, {
            setHeaders: (res, filePath) => {
               // Set proper content type for videos
               if (filePath.endsWith('.mp4')) {
                  res.setHeader('Content-Type', 'video/mp4')
               } else if (filePath.endsWith('.webm')) {
                  res.setHeader('Content-Type', 'video/webm')
               } else if (filePath.endsWith('.mov')) {
                  res.setHeader('Content-Type', 'video/quicktime')
               }
               // Allow cross-origin access
               res.setHeader('Access-Control-Allow-Origin', '*')
            },
         }),
      )
   }

   private initializeDocumentation(): void {
      this.app.use(
         '/api-docs/',
         swaggerUi.serveFiles(Swagger),
         swaggerUi.setup(Swagger, {
            swaggerOptions: { persistAuthorization: true },
            customJs: '/public/swagger-custom.js',
         }),
      )
   }

   private initializeControllers(): void {
      this.app.get(
         '/',
         noAsyncHandler((req: Request, res: Response) =>
            res.status(StatusCodes.OK).json({
               success: true,
               msg: ReasonPhrases.OK,
            }),
         ),
      )
      Routes.forEach((controller: { path: string; router: Router }) => {
         this.app.use(controller.path, controller.router)
      })
      this.app.all(/.*/, (req, res, next) => {
         next(
            new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               'Endpoint not found!',
            ),
         )
      })
   }
   

   private initializeErrorHandling(): void {
      this.app.use(errorMiddleware)
   }
}

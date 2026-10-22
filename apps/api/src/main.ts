<<<<<<< HEAD
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as express from "express"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(",").map((o: string) => o.trim()) || "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })

  const port = process.env.PORT || 3001

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Tornuti API")
    .setDescription("API backend de Tornuti - Plataforma de torneos con gamificación Aura")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  // Serverless-compatible: don't call app.listen() directly in Vercel
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Vercel serverless function entry
    export async function handler(event: any, context: any) {
      // The app is already created in the module; handle the request
      return { statusCode: 200, body: "Tornuti API ready" }
    }
    return
  }

  // Only start listening in development/local mode
  if (process.env.NODE_ENV !== "production") {
    await app.listen(port)
    console.log(`🚀 Tornuti API running on http://localhost:${port}`)
  }
}
bootstrap()
=======
import "reflect-metadata"
import { Logger, ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import helmet from "helmet"
import { AppModule } from "./app.module"
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false })
  const config = app.get(ConfigService)
  const logger = new Logger("Bootstrap")

  const secret = config.get<string>("JWT_SECRET")
  if (!secret || secret === "cambia-esto-por-un-secreto-largo-y-aleatorio") {
    if (config.get("NODE_ENV") === "production") {
      throw new Error("JWT_SECRET debe configurarse con un valor único en producción")
    }
    logger.warn("JWT_SECRET no está configurado; copia apps/api/.env.example a apps/api/.env")
  }

  const origins = config
    .get<string>("CORS_ORIGIN", "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

  app.setGlobalPrefix("api")
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  )
  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  app.useGlobalFilters(new AllExceptionsFilter())
  app.enableShutdownHooks()

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Tornuti API")
    .setDescription(
      "Torneos, equipos, inscripciones, cuadros, resultados y Aura. Autenticación con JWT Bearer.",
    )
    .setVersion("1.0.0")
    .addBearerAuth()
    .addTag("auth")
    .addTag("users")
    .addTag("teams")
    .addTag("tournaments")
    .addTag("matches")
    .addTag("aura")
    .addTag("health")
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("docs", app, document, {
    useGlobalPrefix: true,
    swaggerOptions: { persistAuthorization: true },
  })

  const port = Number(config.get("PORT") ?? 3001)
  await app.listen(port, "0.0.0.0")
  logger.log(`API disponible en http://localhost:${port}/api`)
  logger.log(`Documentación en http://localhost:${port}/api/docs`)
}

void bootstrap()
>>>>>>> origin/main

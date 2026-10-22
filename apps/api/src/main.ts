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

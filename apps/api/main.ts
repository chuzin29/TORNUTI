import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(",").map((o: string) => o.trim()) || "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })

  const port = process.env.PORT || 3001

  // Serverless-compatible: don't call app.listen() directly in Vercel
  // The framework (Vercel) handles the server lifecycle
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    // When deployed as a Vercel serverless function, export the handler
    export async function handler(event: any, context: any) {
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
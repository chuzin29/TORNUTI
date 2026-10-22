import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { Request, Response } from "express"

interface ErrorBody {
  statusCode: number
  error: string
  message: string | string[]
  path: string
  timestamp: string
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const request = context.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message: string | string[] = "Error interno del servidor"
    let error = "Internal Server Error"

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const body = exception.getResponse()
      if (typeof body === "string") {
        message = body
      } else if (typeof body === "object" && body !== null) {
        const record = body as { message?: string | string[]; error?: string }
        message = record.message ?? exception.message
        error = record.error ?? exception.name
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === "P2002") {
        status = HttpStatus.CONFLICT
        error = "Conflict"
        message = "Ya existe un registro con esos datos"
      } else if (exception.code === "P2025") {
        status = HttpStatus.NOT_FOUND
        error = "Not Found"
        message = "El recurso solicitado no existe"
      } else {
        status = HttpStatus.BAD_REQUEST
        error = "Database Error"
        message = "La operación no se pudo completar"
      }
    } else if (exception instanceof Prisma.PrismaClientInitializationError) {
      status = HttpStatus.SERVICE_UNAVAILABLE
      error = "Service Unavailable"
      message = "La base de datos no está disponible"
    } else if (exception instanceof Error && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception.message, exception.stack)
    }

    const body: ErrorBody = {
      statusCode: status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    }

    if (response.headersSent) return
    response.status(status).json(body)
  }
}

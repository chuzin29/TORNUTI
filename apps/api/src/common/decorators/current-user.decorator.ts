import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export interface AuthUser {
  userId: string
  email: string
  role: string
}

export const CurrentUser = createParamDecorator(
  (field: keyof AuthUser | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{ user: AuthUser }>()
    return field ? request.user?.[field] : request.user
  },
)

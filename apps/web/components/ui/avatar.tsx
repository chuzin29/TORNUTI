"use client"

import { Avatar as RadixAvatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

interface AvatarProps {
  className?: string
  size?: "sm" | "md" | "lg"
  fallback?: string
  src?: string
}

export const Avatar = ({ 
  className, 
  size = "md", 
  fallback, 
  src,
  ...props 
}: AvatarProps) => {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <RadixAvatar 
      className={cn(
        sizeMap[size],
        "rounded-full border border-border",
        className
      )}
      src={src}
      fallback={fallback}
      {...props}
    />
  )
}

Avatar.displayName = "Avatar"
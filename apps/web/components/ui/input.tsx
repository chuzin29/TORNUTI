"use client"

import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "outline" | "underlined"
  size?: "default" | "sm" | "lg"
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ 
  className, 
  variant = "default", 
  size = "default", 
  error,
  ...props 
}, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "default":
        return "border-b-2 border-border placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-0 transition-colors"
      case "outline":
        return "w-full border-2 border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
      case "underlined":
        return "w-full border-b-2 border-border placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-0 transition-colors"
      default:
        return "border-b-2 border-border placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-0 transition-colors"
    }
  }

  return (
    <div className="group">
      <input
        ref={ref}
        className={cn(
          "w-full bg-transparent py-2 text-base outline-none transition-colors",
          getVariantStyles(),
          error && "text-destructive",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-destructive/80">
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = "Input"
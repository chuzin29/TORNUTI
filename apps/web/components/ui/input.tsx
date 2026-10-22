import * as React from "react"
import { cn } from "@/lib/utils"

function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  optional?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("w-full", className)}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional ? (
          <span className="ml-1.5 font-normal text-muted-foreground">(opcional)</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
  optional?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, hint, error, optional, className, ...props }, ref) => {
    const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-")
    return (
      <FieldShell id={fieldId} label={label} hint={hint} error={error} optional={optional}>
        <input
          ref={ref}
          id={fieldId}
          className={cn("field", error && "border-danger focus:border-danger focus:ring-danger/20", className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          {...props}
        />
      </FieldShell>
    )
  },
)
Input.displayName = "Input"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
  error?: string
  optional?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id, label, hint, error, optional, className, ...props }, ref) => {
    const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-")
    return (
      <FieldShell id={fieldId} label={label} hint={hint} error={error} optional={optional}>
        <textarea
          ref={ref}
          id={fieldId}
          className={cn("field min-h-28 resize-y py-2.5", error && "border-danger focus:border-danger focus:ring-danger/20", className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          {...props}
        />
      </FieldShell>
    )
  },
)
Textarea.displayName = "Textarea"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
  error?: string
  optional?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, label, hint, error, optional, className, children, ...props }, ref) => {
    const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-")
    return (
      <FieldShell id={fieldId} label={label} hint={hint} error={error} optional={optional}>
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            className={cn("field appearance-none pr-9", error && "border-danger focus:border-danger", className)}
            aria-invalid={error ? true : undefined}
            {...props}
          >
            {children}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </FieldShell>
    )
  },
)
Select.displayName = "Select"

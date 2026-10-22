"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ToastTone = "success" | "info" | "error"

interface Toast {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

interface ToastContextValue {
  push: (toast: Omit<Toast, "id">) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const counter = React.useRef(0)

  const remove = React.useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = React.useCallback(
    ({ title, description, tone = "info" }: Omit<Toast, "id">) => {
      counter.current += 1
      const id = counter.current
      setToasts((current) => [...current, { id, title, description, tone }])
      window.setTimeout(() => remove(id), 4800)
    },
    [remove],
  )

  const value = React.useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto flex w-full max-w-sm animate-pop-in items-start gap-3 rounded-md border bg-surface p-3.5 shadow-lift",
              toast.tone === "success" && "border-success/40",
              toast.tone === "error" && "border-danger/40",
              toast.tone === "info" && "border-line",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                toast.tone === "success" && "bg-success text-success-foreground",
                toast.tone === "error" && "bg-danger text-danger-foreground",
                toast.tone === "info" && "bg-primary text-primary-foreground",
              )}
              aria-hidden="true"
            >
              {toast.tone === "success" ? (
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                  <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : toast.tone === "error" ? (
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                  <path d="M8 4v5M8 11.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                  <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug">{toast.title}</p>
              {toast.description ? (
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => remove(toast.id)}
              className="focus-ring -mr-1 -mt-1 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label="Cerrar aviso"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error("useToast debe usarse dentro de ToastProvider")
  return context
}

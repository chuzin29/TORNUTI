"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check if prefers-color-scheme is dark, or if class is already 'dark'
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle("dark", isDark)
    localStorage.setItem("tornuti-theme", isDark ? "dark" : "light")
  }, [isDark])

  return (
    <button
      onClick = () => setIsDark((prev) => !prev)
      className="p-2 rounded-md hover:bg-accent hover:text-accent-transition transition-colors"
      aria-label="Alternar modo oscuro"
    >
      {isDark ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  )
}
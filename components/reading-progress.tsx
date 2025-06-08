"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    console.log("Reading progress component mounted")
    
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      
      setProgress(Math.min(100, Math.max(0, scrollPercent)))
      console.log("Reading progress updated:", scrollPercent.toFixed(1) + "%")
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    updateProgress() // Initial calculation

    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <motion.div
      className="reading-progress"
      style={{ width: `${progress}%` }}
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.1, ease: "linear" }}
    />
  )
}
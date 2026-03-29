// components/chat/loader.tsx
"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export function ThinkingLoader() {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
            className="h-2 w-2 rounded-full bg-primary"
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        Thinking...
      </span>
    </div>
  )
}

export function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/50 max-w-[90%] sm:max-w-[85%] animate-in fade-in duration-300">
      {/* Header with avatar */}
      <div className="flex items-center gap-2 mb-1">
        <motion.div
          className="p-1.5 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
        </motion.div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Saify</span>
      </div>

      {/* Animated skeleton lines */}
      <div className="space-y-2.5">
        {[100, 85, 70, 40].map((width, i) => (
          <motion.div
            key={i}
            className="h-3 rounded-full bg-gradient-to-r from-muted-foreground/10 via-muted-foreground/20 to-muted-foreground/10"
            style={{ width: `${width}%` }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              backgroundPosition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              },
            }}
          />
        ))}
      </div>

      {/* Pulsing indicator */}
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/20">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
              className="h-1.5 w-1.5 rounded-full bg-blue-500"
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground/70">Generating response...</span>
      </div>
    </div>
  )
}
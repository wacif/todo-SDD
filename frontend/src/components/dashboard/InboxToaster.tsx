'use client'

import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

export interface InboxToast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export function InboxToaster({
  toasts,
  onDismiss,
}: {
  toasts: InboxToast[]
  onDismiss: (id: string) => void
}) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: InboxToast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const icons = {
    success: <CheckCircle2 size={18} className="text-green-400" />,
    error: <AlertCircle size={18} className="text-red-400" />,
    info: <Info size={18} className="text-indigo-400" />,
  }

  const styles = {
    success: 'bg-[#0c0c0e] border-green-500/20',
    error: 'bg-[#0c0c0e] border-red-500/20',
    info: 'bg-[#0c0c0e] border-indigo-500/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      layout
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md w-80 ${styles[toast.type]}`}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <p className="flex-1 text-sm font-medium text-gray-200">{toast.message}</p>
      <button onClick={() => onDismiss(toast.id)} className="p-1 text-gray-500 hover:text-white transition-colors" aria-label="Dismiss toast">
        <X size={14} />
      </button>
    </motion.div>
  )
}



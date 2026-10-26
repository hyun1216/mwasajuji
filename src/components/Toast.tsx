'use client';

import { useToastStore } from '@/store/useToastStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { message, type } = useToastStore();

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[390px] pointer-events-none"
        >
          <div className="flex items-center gap-2.5 px-4 py-3 bg-zinc-900/95 backdrop-blur-md text-white rounded-2xl shadow-xl border border-zinc-800 text-sm font-medium">
            {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {type === 'warn' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
            {type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
            <span className="flex-1 break-keep leading-snug">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

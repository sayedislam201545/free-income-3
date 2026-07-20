import React from 'react';
import { useUIStore } from '../store/useUIStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function GlobalUI() {
  const { toasts, confirmDialog, hideConfirm } = useUIStore();

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center space-y-2 pointer-events-none w-full max-w-sm px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl pointer-events-auto border backdrop-blur-md w-full
                ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 
                  toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 
                  'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}
            >
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
              <span className="font-medium text-sm">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {confirmDialog && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                confirmDialog.onCancel?.();
                hideConfirm();
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-300 rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{confirmDialog.title}</h3>
              <p className="text-gray-600 text-sm mb-6">{confirmDialog.message}</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    confirmDialog.onCancel?.();
                    hideConfirm();
                  }}
                  className="flex-1 py-3 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    hideConfirm();
                  }}
                  className="flex-1 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

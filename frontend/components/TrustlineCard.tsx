'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Link2, RefreshCw, Coins } from 'lucide-react';
import { useTrustline } from '@/hooks/useTrustline';
import { accentPulse, successBurst } from '@/lib/animations';
import { useState } from 'react';
import useSWR from 'swr';

export function TrustlineCard({ publicKey }: { publicKey: string }) {
  const { hasTrustline, bitBalance, bitLimit, isLoading, isAdding, addTrustline } =
    useTrustline(publicKey);
  const { isValidating } = useSWR(publicKey ? `/api/balance/${publicKey}` : null);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = async () => {
    await addTrustline();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 5000);
  };

  const greenPulse = {
    animate: { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  };

  if (isLoading) {
    return (
      <div className="bg-surface-base rounded-2xl border border-border-subtle p-6 flex items-center gap-4 animate-pulse">
        <RefreshCw size={20} className="animate-spin text-gray-300" />
        <div className="flex flex-col gap-2 w-full">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-surface-base rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!hasTrustline ? (
        <motion.div
          key="warning"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center shadow-sm"
        >
          <div className="bg-green-100 p-3 rounded-xl">
            <AlertCircle size={24} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-green-900 leading-tight">Trustline required</h3>
            <p className="text-green-700/70 text-sm font-medium mt-1">
              To receive and swap BIT tokens, your wallet must first establish a trustline.
            </p>
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="w-full sm:w-auto bg-green-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-500/20 disabled:bg-green-300 flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Link2 size={18} />
                <span>Add Trustline</span>
              </>
            )}
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="active"
          variants={successBurst}
          initial="initial"
          animate="animate"
          className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col gap-6 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <CheckCircle2 size={24} className="text-green-600" />
                <motion.div 
                  variants={greenPulse}
                  animate="animate"
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500"
                />
              </div>
              <h3 className="text-lg font-black text-green-900 leading-tight uppercase tracking-tight">Trustline Active</h3>
            </div>
            <div className="text-xs font-black text-green-600/60 uppercase tracking-widest bg-green-100 px-3 py-1 rounded-full">
              Limit: {parseFloat(bitLimit).toLocaleString()} BIT
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-green-100 pt-5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-green-700/50">Portfolio Balance</span>
              <div className="flex items-center gap-2">
                <Coins size={18} className="text-green-600" />
                <span className="text-3xl font-black text-green-900 leading-none">
                  {parseFloat(bitBalance).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </span>
                <span className="text-sm font-black text-green-700/60 mb-1">BIT</span>
              </div>
            </div>
            <RefreshCw
              size={14}
              className={`text-green-300 transition-colors ${isValidating ? 'animate-spin text-green-500' : ''}`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

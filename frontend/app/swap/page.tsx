'use client';
import { motion } from 'framer-motion';
import { SwapCard } from '@/components/SwapCard';
import { BottomNav } from '@/components/BottomNav';
import { revealUp } from '@/lib/animations';

export default function SwapPage() {
  return (
    <main className="min-h-screen bg-surface-base flex flex-col items-center p-6 pt-20 pb-32">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealUp}
        className="w-full max-w-lg mx-auto flex flex-col gap-8"
      >
        <div className="text-center flex flex-col gap-3">
          <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase">Token Swap</h1>
          <p className="text-text-secondary font-medium max-w-md mx-auto">
            Instant on-chain swaps between BIT and XLM using Soroban smart contracts.
          </p>
        </div>

        <SwapCard />

        {/* Price Chart Placeholder */}
        <motion.div 
          variants={revealUp}
          className="bg-surface-base rounded-3xl h-48 border border-border-subtle flex flex-col items-center justify-center p-8 mt-4"
        >
          <div className="w-full h-full border-2 border-dashed border-border-subtle rounded-2xl flex items-center justify-center">
            <span className="text-text-muted font-black text-xs uppercase tracking-[0.2em]">Price chart — coming soon</span>
          </div>
        </motion.div>
      </motion.div>
      <BottomNav />
    </main>
  );
}

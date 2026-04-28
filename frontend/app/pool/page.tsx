'use client';
import { motion } from 'framer-motion';
import { LiquidityCard } from '@/components/LiquidityCard';
import { BottomNav } from '@/components/BottomNav';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { usePoolStats } from '@/hooks/usePoolStats';
import { revealUp, stagger, listContainer, listItem } from '@/lib/animations';

export default function PoolPage() {
  const { tvl, apy } = usePoolStats();

  const STEPS = [
    { title: 'Add Assets', desc: 'Deposit both BIT and XLM in equal value to the liquidity pool.' },
    { title: 'Earn Yield', desc: 'Automatically earn a share of every protocol swap fee.' },
    { title: 'Withdraw Anytime', desc: 'Redeem your LP tokens for your original assets plus earnings.' },
  ];

  return (
    <main className="min-h-screen bg-surface-base p-6 pt-20 pb-32">
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        
        {/* Header & Main Card */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealUp}
          className="max-w-lg mx-auto w-full flex flex-col gap-8"
        >
          <div className="text-center flex flex-col gap-3">
            <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase">Protocol Liquidity</h1>
            <p className="text-text-secondary font-medium">Supply assets to the Soroban pool and earn protocol fees.</p>
          </div>
          <LiquidityCard />
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Value Locked', value: parseFloat(tvl), prefix: '$', decimals: 0 },
            { label: 'Your Pool Share', value: 1.24, suffix: '%', decimals: 2 },
            { label: 'Active APY', value: parseFloat(apy), suffix: '%', decimals: 1 },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={revealUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-raised p-6 rounded-3xl border border-border-subtle shadow-sm"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">{stat.label}</p>
              <div className="text-3xl font-black text-text-primary">
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={listContainer}
          className="flex flex-col gap-8"
        >
          <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <motion.div 
                key={i}
                variants={listItem}
                className="bg-surface-raised p-8 rounded-3xl border border-border-subtle flex flex-col gap-4 shadow-sm"
              >
                <div className="bg-green-500 text-white rounded-xl w-10 h-10 flex items-center justify-center font-black text-lg">
                  {i + 1}
                </div>
                <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">{step.title}</h3>
                <p className="text-text-secondary font-medium text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>
      <BottomNav />
    </main>
  );
}

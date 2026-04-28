'use client';
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Droplets, Zap, RefreshCw, Activity } from 'lucide-react';
import { useBitPrice } from '@/hooks/useBitPrice';
import { usePoolStats } from '@/hooks/usePoolStats';
import { stagger, accentPulse } from '@/lib/animations';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { SkeletonCard } from '@/components/Skeleton';
import useSWR from 'swr';

interface StatItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: string;
  icon: React.ElementType;
}

const StatMetric = memo(function StatMetric({ item, index }: { item: StatItem; index: number }) {
  const { icon: Icon, label, value, prefix, suffix, decimals, delta } = item;
  const isPositive = delta?.startsWith('+');

  return (
    <motion.div
      variants={stagger(index)}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="bg-surface-raised rounded-2xl border border-border-subtle p-6 flex flex-col gap-4 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)] hover:border-green-200 transition-colors group"
    >
      <div className="flex justify-between items-start">
        <div className="text-label text-text-muted group-hover:text-green-600 transition-colors">{label}</div>
        <div className="p-2 bg-surface-base rounded-lg group-hover:bg-green-50 transition-colors text-text-muted group-hover:text-green-500">
          <Icon size={16} />
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-black text-text-primary tracking-tight">
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
        </div>
        {delta && (
          <div className={`inline-flex items-center self-start px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {delta}
          </div>
        )}
      </div>
    </motion.div>
  );
});

export const StatsBar = memo(function StatsBar() {
  const { price, change24h, isLoading: priceLoading } = useBitPrice();
  const { tvl, volume24h, apy, isLoading: poolLoading } = usePoolStats();
  const { isValidating: priceValidating } = useSWR('/api/price');
  const { isValidating: poolValidating }  = useSWR('/api/pool');
  const isValidating = priceValidating || poolValidating;
  const isLoading    = priceLoading || poolLoading;

  const stats: StatItem[] = [
    {
      label: 'BIT Price',
      value: parseFloat(price),
      prefix: '$',
      decimals: 4,
      delta: `${parseFloat(change24h) >= 0 ? '+' : ''}${change24h}%`,
      icon: TrendingUp,
    },
    {
      label: 'Total Value Locked',
      value: parseFloat(tvl),
      prefix: '$',
      decimals: 0,
      delta: '+4.2%',
      icon: Droplets,
    },
    {
      label: '24h Volume',
      value: parseFloat(volume24h),
      prefix: '$',
      decimals: 0,
      delta: '-1.8%',
      icon: Zap,
    },
    {
      label: 'Current APY',
      value: parseFloat(apy),
      suffix: '%',
      decimals: 1,
      delta: '+0.5%',
      icon: Activity,
    },
  ];

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/10 p-2 rounded-lg">
            <TrendingUp size={18} className="text-green-500" />
          </div>
          <div>
            <h2 className="text-lg font-black text-text-primary tracking-tight">Protocol Pulse</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <motion.div {...accentPulse} className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Live Mainnet Feed</span>
            </div>
          </div>
        </div>
        
        <RefreshCw
          size={16}
          className={`text-gray-300 transition-colors ${isValidating ? 'animate-spin text-green-500' : ''}`}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? [0, 1, 2, 3].map((i) => <SkeletonCard key={i} rows={2} />)
          : stats.map((s, i) => <StatMetric key={s.label} item={s} index={i} />)
        }
      </div>
    </section>
  );
});

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Zap } from 'lucide-react';
import Link from 'next/link';
import { useFreighter } from '@/hooks/useFreighter';
import { usePoolStats } from '@/hooks/usePoolStats';
import { StatsBar } from '@/components/StatsBar';
import { BottomNav } from '@/components/BottomNav';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { useTilt } from '@/hooks/useTilt';
import { zeroG, floatUp, stagger, orb, revealUp } from '@/lib/animations';

const FEATURES = [
  { title: 'Swap Tokens', desc: 'Instantly swap BIT ↔ XLM using the Soroban liquidity pool.', href: '/swap', cta: 'Start Swapping' },
  { title: 'Provide Liquidity', desc: 'Add BIT + XLM to the pool and earn yield on your position.', href: '/pool', cta: 'Add Liquidity' },
  { title: 'Your Dashboard', desc: 'Monitor your BIT balance, trustline status, and live transactions.', href: '/dashboard', cta: 'View Dashboard' },
];

export default function HomePage() {
  const { isConnected, connect } = useFreighter();
  const { tvl, apy } = usePoolStats();
  const [mounted, setMounted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const { ref: coinRef, style: coinTiltStyle, ...coinTiltHandlers } = useTilt(20);

  useEffect(() => setMounted(true), []);

  const scrollToStats = () => {
    statsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!mounted) return <div className="min-h-screen bg-surface-raised" />;

  return (
    <main className="min-h-screen bg-surface-raised">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-80px)] min-h-[700px] flex items-center overflow-hidden bg-surface-raised px-6">
        {/* Ambient Background Elements */}
        <motion.div {...orb(0)} className="absolute top-20 right-10 w-96 h-96 rounded-full bg-green-500/5 z-0" />
        <motion.div {...orb(2)} className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-surface-base/50 z-0" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center z-10">
          {/* Left Column: Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={revealUp}
          >
            <div className="text-label text-green-600 mb-6 font-black tracking-[0.2em]">
              Stellar DeFi Protocol
            </div>
            <h1 className="text-display text-text-primary mb-8">
              BitPay<br />Finance
            </h1>
            <p className="text-xl text-text-secondary max-w-lg mb-10 leading-relaxed font-medium">
              Minimal, high-performance DeFi on Stellar. Swap, pool, and earn yield — fully on-chain via Soroban.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link href={isConnected ? "/dashboard" : "#"} onClick={!isConnected ? connect : undefined}>
                <button className="bg-green-500 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-green-600 active:scale-95 transition-all">
                  {isConnected ? 'Open Dashboard' : 'Get Started'}
                </button>
              </Link>
              <button className="border-2 border-text-primary text-text-primary px-10 py-5 rounded-2xl font-black text-lg hover:bg-text-primary hover:text-text-inverse active:scale-95 transition-all">
                Documentation
              </button>
            </div>

            {/* Hero Stats */}
            <div className="flex items-center gap-12 pt-8 border-t border-border-subtle">
              <div className="flex flex-col">
                <div className="text-3xl font-black text-text-primary mb-1">
                  <AnimatedNumber value={parseFloat(tvl)} prefix="$" decimals={0} />
                </div>
                <span className="text-label text-text-muted">Total Value Locked</span>
              </div>
              <div className="h-10 w-px bg-border-subtle" />
              <div className="flex flex-col">
                <div className="text-3xl font-black text-green-500 mb-1">
                  <AnimatedNumber value={parseFloat(apy)} suffix="%" decimals={1} />
                </div>
                <span className="text-label text-text-muted">Current APY</span>
              </div>
              <div className="h-10 w-px bg-border-subtle" />
              <div className="flex flex-col">
                <div className="text-3xl font-black text-text-primary mb-1">
                  <AnimatedNumber value={24000} suffix="+" decimals={0} />
                </div>
                <span className="text-label text-text-muted">Total Users</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual */}
          <div className="hidden lg:flex justify-center items-center">
            <motion.div
              ref={coinRef}
              style={coinTiltStyle}
              {...coinTiltHandlers}
              className="relative"
            >
              <motion.div
                {...zeroG}
                className="w-64 h-64 bg-green-500 rounded-full flex items-center justify-center"
              >
                <Zap size={120} className="text-white fill-white" />
                {/* Orbiting Dot */}
                <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 border-4 border-surface-raised rounded-full" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={scrollToStats}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-label text-text-muted">Scroll to Explore</span>
            <ChevronDown className="text-green-500" size={32} />
          </motion.div>
        </motion.div>
      </section>

      {/* Live Stats Strip */}
      <motion.div 
        ref={statsRef} 
        variants={revealUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-surface-base border-y border-border-subtle py-12"
      >
        <div className="max-w-7xl mx-auto px-6">
          <StatsBar />
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURES.map(({ title, desc, href, cta }, i) => (
          <motion.div
            key={href}
            variants={stagger(i)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="bg-surface-raised p-10 rounded-3xl border border-border-subtle flex flex-col gap-6"
          >
            <h3 className="text-2xl font-black text-text-primary">{title}</h3>
            <p className="text-text-secondary leading-relaxed font-medium flex-1">{desc}</p>
            <Link href={href}>
              <button className="w-full bg-text-primary text-text-inverse font-bold py-4 rounded-2xl hover:bg-green-500 transition-colors">
                {cta}
              </button>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="pb-20">
        <BottomNav />
      </div>
    </main>
  );
}

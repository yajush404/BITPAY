'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wallet, Activity, RefreshCw, Zap } from 'lucide-react';
import { useFreighter } from '@/hooks/useFreighter';
import { useContractEvents } from '@/hooks/useContractEvents';
import { floatUp, accentPulse, drawerUp, tabIndicator } from '@/lib/animations';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/swap', label: 'Swap' },
  { href: '/pool', label: 'Pool' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, connect, publicKey, isLoading } = useFreighter();
  const { events } = useContractEvents();
  const [mobileOpen, setMobileOpen] = useState(false);

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="sticky top-0 z-50 bg-surface-raised border-b border-border-subtle h-20"
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-green-500 text-white rounded-lg w-9 h-9 flex items-center justify-center font-black text-sm transition-transform group-hover:scale-110 group-active:scale-95">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="font-black text-xl tracking-tight text-text-primary">BitPay</span>
        </Link>

        {/* Center: Desktop Nav */}
        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="hidden md:flex items-center gap-8"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <motion.div key={href} variants={itemVariants} className="relative group h-20 flex items-center">
                <Link
                  href={href}
                  className={`text-sm font-bold transition-colors ${
                    active ? 'text-green-600' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {label}
                </Link>
                {/* Animated Underline */}
                {active ? (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 w-full h-1 bg-green-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          {/* Activity Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-surface-base border border-border-subtle px-3 py-1.5 rounded-full">
            <motion.div 
              {...accentPulse}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
              <Activity size={12} className="text-text-muted" />
              {events.length} Events
            </span>
          </div>

          {/* Freighter Button */}
          <button
            onClick={connect}
            disabled={isLoading}
            className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : isConnected ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                <span className="text-sm">
                  {typeof publicKey === 'string' && publicKey.length > 5 
                    ? `${publicKey.slice(0, 5)}...${publicKey.slice(-4)}`
                    : 'Connected'}
                </span>
              </>
            ) : (
              <>
                <Wallet size={18} />
                <span className="text-sm">Connect Wallet</span>
              </>
            )}
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-primary hover:bg-surface-base rounded-lg transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={drawerUp}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute top-20 left-0 w-full bg-surface-raised border-b border-border-subtle z-40 md:hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-2xl font-black py-2 ${
                    pathname === href ? 'text-green-600' : 'text-text-primary'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={() => { connect(); setMobileOpen(false); }}
                className="mt-4 w-full bg-green-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
              >
                <Wallet size={20} />
                {isConnected ? `${publicKey.slice(0, 5)}...${publicKey.slice(-4)}` : 'Connect Wallet'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

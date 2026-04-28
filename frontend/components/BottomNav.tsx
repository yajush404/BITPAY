'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, ArrowUpDown, Droplets, BarChart3 } from 'lucide-react';
import { accentPulse, tabIndicator } from '@/lib/animations';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/swap', label: 'Swap', icon: ArrowUpDown },
  { href: '/pool', label: 'Pool', icon: Droplets },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-raised border-t border-border-subtle z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="relative flex flex-col items-center justify-center gap-1 w-full h-full">
              <Icon 
                size={20} 
                className={`transition-colors duration-200 ${active ? 'text-green-500' : 'text-text-muted'}`} 
              />
              <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-green-500' : 'text-text-muted'}`}>
                {label}
              </span>
              
              {active && (
                <div className="absolute -bottom-1 flex flex-col items-center">
                  <motion.div 
                    layoutId="bottom-nav-indicator"
                    variants={tabIndicator}
                    initial="initial"
                    animate="animate"
                    className="w-8 h-1 bg-green-500 rounded-t-full"
                  />
                  <motion.div 
                    {...accentPulse}
                    className="w-1.5 h-1.5 rounded-full bg-green-500 mt-0.5"
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

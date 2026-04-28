'use client';
import { motion } from 'framer-motion';
import { Activity, Wallet, ArrowUpRight, RefreshCw, Coins } from 'lucide-react';
import { useFreighter } from '@/hooks/useFreighter';
import { useBitBalance } from '@/hooks/useBitBalance';
import { useContractEvents } from '@/hooks/useContractEvents';
import { TrustlineCard } from '@/components/TrustlineCard';
import { BottomNav } from '@/components/BottomNav';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { revealUp, stagger, listContainer, listItem, accentPulse } from '@/lib/animations';

export default function DashboardPage() {
  const { isConnected, connect, publicKey, network, isLoading } = useFreighter();
  const { bitBalance, xlmBalance, isLoading: balLoading } = useBitBalance(publicKey);
  const { events, isLoading: eventsLoading } = useContractEvents();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface-raised p-6">
        <RefreshCw size={40} className="animate-spin text-green-500" />
      </main>
    );
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface-raised p-6">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={revealUp}
          className="max-w-md w-full flex flex-col items-center gap-8 text-center"
        >
          <div className="bg-green-50 p-8 rounded-[2.5rem] border border-green-100">
            <Wallet size={80} className="text-green-500" />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-black text-text-primary tracking-tighter uppercase">Secure Access</h1>
            <p className="text-text-secondary font-medium leading-relaxed">
              Connect your Stellar wallet to monitor your portfolio and track protocol events.
            </p>
          </div>
          <button 
            className="w-full bg-green-500 text-white font-black py-5 rounded-3xl hover:bg-green-600 active:scale-95 transition-all shadow-xl shadow-green-500/20"
            onClick={connect}
          >
            Connect Wallet
          </button>
        </motion.div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-base p-6 pt-20 pb-32">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        
        {/* Header */}
        <motion.div 
          variants={revealUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600">Connected to {network}</span>
            </div>
            <h1 className="text-5xl font-black text-text-primary tracking-tighter uppercase">Dashboard</h1>
            <p className="text-text-muted font-mono text-xs truncate max-w-sm">
              {typeof publicKey === 'string' 
                ? publicKey 
                : (publicKey as any)?.address || (publicKey as any)?.publicKey || String(publicKey)}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-surface-raised border border-border-subtle px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors">
              Export CSV
            </button>
            <button className="bg-surface-raised border border-border-subtle px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors">
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'BIT Portfolio', value: parseFloat(bitBalance), sub: 'BitPay Token', color: 'text-green-500' },
            { label: 'XLM Balance', value: parseFloat(xlmBalance), sub: 'Stellar Native', color: 'text-text-muted' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              variants={stagger(i)}
              initial="initial"
              animate="animate"
              className="bg-surface-raised p-8 rounded-[2rem] border border-border-subtle shadow-sm relative overflow-hidden"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4">{card.label}</p>
              <div className="text-5xl font-black text-text-primary tracking-tighter">
                <AnimatedNumber value={card.value} decimals={4} />
              </div>
              <p className={`text-xs font-black uppercase tracking-widest mt-2 ${card.color}`}>{card.sub}</p>
              <div className="absolute top-8 right-8 text-gray-100">
                <Coins size={48} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trustline Area */}
        <motion.div variants={revealUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <TrustlineCard publicKey={publicKey} />
        </motion.div>

        {/* Faucet Banner */}
        <motion.div 
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-green-500 rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Testnet Faucet</h2>
            <p className="font-medium text-green-100 max-w-md">
              Need assets for testing? Mint 1,000 BIT instantly to your wallet and start exploring the protocol.
            </p>
          </div>
          <button 
            className="bg-surface-raised text-green-500 font-black px-10 py-5 rounded-2xl hover:bg-green-50 transition-all active:scale-95"
            onClick={async () => {
              try {
                const res = await fetch('/api/admin/mint', {
                  method: 'POST',
                  body: JSON.stringify({ recipient: publicKey, amount: '1000', callerPubKey: publicKey })
                });
                const data = await res.json();
                if (data.hash) alert("Success! 1,000 BIT Minted.");
              } catch (e) { alert("Mint failed"); }
            }}
          >
            Mint 1,000 BIT
          </button>
        </motion.div>

        {/* Activity Feed */}
        <motion.div 
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-surface-raised rounded-[2rem] border border-border-subtle overflow-hidden shadow-sm"
        >
          <div className="bg-surface-base px-8 py-6 border-b border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity size={20} className="text-text-muted" />
              <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Recent Transactions</h3>
              <motion.div {...accentPulse} className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 hover:text-green-700">View All</button>
          </div>
          
          <div className="flex flex-col">
            {eventsLoading ? (
              <div className="p-20 flex flex-col items-center gap-4">
                <RefreshCw size={32} className="animate-spin text-green-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Loading activity...</span>
              </div>
            ) : (
              <motion.div variants={listContainer} className="divide-y divide-gray-50">
                {events.slice(0, 10).map((event) => (
                  <motion.div 
                    key={event.id}
                    variants={listItem}
                    className="px-8 py-6 flex items-center justify-between hover:bg-surface-base transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface-base rounded-xl flex items-center justify-center text-text-muted group-hover:bg-green-50 group-hover:text-green-500 transition-colors">
                        <ArrowUpRight size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-text-primary uppercase tracking-tight">{event.type}</span>
                        <span className="text-xs font-mono text-text-muted truncate max-w-[150px]">{event.txHash}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right flex flex-col">
                        <span className="text-sm font-black text-text-primary">
                          {parseFloat(event.amount).toFixed(2)} BIT
                        </span>
                        <span className="text-[10px] text-text-muted font-medium">
                          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <a href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`} target="_blank" className="text-gray-300 hover:text-green-500 transition-colors">
                        <ArrowUpRight size={20} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

      </div>
      <BottomNav />
    </main>
  );
}

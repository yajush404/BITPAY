'use client';
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ExternalLink, RefreshCw } from 'lucide-react';
import { useContractEvents, ContractEvent } from '@/hooks/useContractEvents';
import { listContainer, listItem, accentPulse } from '@/lib/animations';
import useSWR from 'swr';

const EVENT_COLORS: Record<ContractEvent['type'], string> = {
  mint:      'bg-green-400',
  burn:      'bg-red-400',
  swap:      'bg-blue-400',
  liquidity: 'bg-purple-400',
  trustline: 'bg-green-400',
  fee:       'bg-amber-400',
};

const EventRow = memo(function EventRow({ event }: { event: ContractEvent }) {
  return (
    <motion.div
      variants={listItem}
      className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-surface-base transition-colors group"
    >
      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${EVENT_COLORS[event.type]} shadow-sm`} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-text-primary capitalize">{event.type}</span>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-surface-base px-2 py-0.5 rounded-full">
            #{event.ledger}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-mono font-bold text-text-secondary">
            {parseFloat(event.amount || '0').toLocaleString(undefined, { maximumFractionDigits: 4 })} AGT
          </span>
          <span className="text-[10px] text-gray-300">•</span>
          <span className="text-[10px] text-text-muted font-medium">
            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <a
        href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:text-green-500 transition-colors p-2"
      >
        <ExternalLink size={14} />
      </a>
    </motion.div>
  );
});

export const EventFeed = memo(function EventFeed() {
  const { events, isLoading, isError } = useContractEvents();
  const { isValidating } = useSWR('/api/events');

  return (
    <div className="bg-surface-raised rounded-3xl border border-border-subtle overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="bg-surface-base border-b border-border-subtle px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity size={18} className="text-text-muted" />
          <h2 className="text-sm font-black text-text-primary uppercase tracking-tight">Live Events</h2>
          <motion.div {...accentPulse} className="w-1.5 h-1.5 rounded-full bg-green-500" />
        </div>
        
        <div className="flex items-center gap-3">
          <RefreshCw
            size={14}
            className={`text-gray-300 transition-colors ${isValidating ? 'animate-spin text-green-500' : ''}`}
          />
          <select className="bg-surface-raised border border-border-subtle rounded-lg text-[10px] font-black uppercase tracking-widest px-2 py-1 outline-none focus:border-green-400 transition-colors">
            <option>All Events</option>
            <option>Swaps</option>
            <option>Liquidity</option>
          </select>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <RefreshCw size={32} className="animate-spin text-green-400" />
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Fetching events...</span>
          </div>
        ) : isError ? (
          <div className="py-20 text-center">
            <span className="text-sm font-bold text-red-400">Failed to load live feed</span>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <RefreshCw size={32} className="animate-spin text-text-muted" />
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Waiting for events...</span>
          </div>
        ) : (
          <motion.div
            variants={listContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {events.slice(0, 15).map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Footer / Fade */}
      <div className="h-8 bg-gradient-to-t from-white to-transparent pointer-events-none absolute bottom-0 left-0 w-full" />
    </div>
  );
});

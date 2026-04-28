'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Wallet, CheckCircle2, RefreshCw, Zap, ExternalLink } from 'lucide-react';
import { useFreighter } from '@/hooks/useFreighter';
import { useBitBalance } from '@/hooks/useBitBalance';
import { useBitPrice } from '@/hooks/useBitPrice';
import { floatUp, successBurst, hoverLift } from '@/lib/animations';
import { useTilt } from '@/hooks/useTilt';
import useSWR from 'swr';
import { poolContract, signAndSubmit, nativeToScVal, bitContract, XLM_CONTRACT, Address } from '@/lib/soroban';

type Dir = 'BIT_TO_XLM' | 'XLM_TO_BIT';

export function SwapCard() {
  const { isConnected, connect, publicKey } = useFreighter();
  const { bitBalance, xlmBalance } = useBitBalance(publicKey);
  const { price, isLoading: priceLoading } = useBitPrice();
  const { isValidating } = useSWR('/api/price');

  const [dir, setDir] = useState<Dir>('BIT_TO_XLM');
  const [amountIn, setAmountIn] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [success, setSuccess] = useState<{ txHash: string } | null>(null);

  const { ref: tiltRef, style: tiltStyle, ...tiltHandlers } = useTilt(8);

  const fromToken = dir === 'BIT_TO_XLM' ? 'BIT' : 'XLM';
  const toToken   = dir === 'BIT_TO_XLM' ? 'XLM' : 'BIT';
  const fromBal   = dir === 'BIT_TO_XLM' ? bitBalance : xlmBalance;
  const priceVal  = parseFloat(price) || 0.05;
  const amountOut = amountIn
    ? (dir === 'BIT_TO_XLM'
        ? (parseFloat(amountIn) * priceVal).toFixed(6)
        : (parseFloat(amountIn) / priceVal).toFixed(6))
    : '';

  const flip = () => {
    setDir((d) => (d === 'BIT_TO_XLM' ? 'XLM_TO_BIT' : 'BIT_TO_XLM'));
    setAmountIn('');
  };

  const doSwap = async () => {
    if (!isConnected) return connect();
    if (!amountIn || parseFloat(amountIn) <= 0) return;
    
    setIsSwapping(true);
    try {
      const tokenInAddress = dir === 'BIT_TO_XLM' ? bitContract.contractId() : XLM_CONTRACT;
      const amountInStroops = BigInt(Math.floor(parseFloat(amountIn) * 1e7));

      const op = poolContract.call(
        'swap',
        new Address(publicKey).toScVal(),
        new Address(tokenInAddress).toScVal(),
        nativeToScVal(amountInStroops, { type: 'i128' }),
      );

      const hash = await signAndSubmit(publicKey, op);
      setSuccess({ txHash: hash });
      setAmountIn('');
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Swap failed");
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            variants={successBurst}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-surface-raised rounded-3xl border-2 border-green-400 p-10 text-center flex flex-col items-center gap-6 shadow-sm"
          >
            <div className="bg-green-50 p-4 rounded-full">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black text-text-primary">Swap Confirmed!</h2>
              <p className="text-text-secondary font-medium">Successfully swapped tokens on Stellar.</p>
            </div>
            <a 
              href={`https://stellar.expert/explorer/testnet/tx/${success.txHash}`} 
              target="_blank" 
              className="flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors"
            >
              View Transaction <ExternalLink size={16} />
            </a>
            <button 
              onClick={() => setSuccess(null)}
              className="mt-4 text-text-muted font-bold hover:text-text-primary transition-colors"
            >
              Back to Swap
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            ref={tiltRef}
            style={tiltStyle}
            {...tiltHandlers}
            variants={floatUp}
            initial="initial"
            animate="animate"
            className="bg-surface-raised rounded-3xl border border-border-subtle p-6 shadow-sm flex flex-col gap-1 relative z-10"
          >
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-lg font-black text-text-primary">Swap</h2>
              <RefreshCw 
                size={16} 
                className={`text-gray-300 transition-colors ${isValidating ? 'animate-spin text-green-500' : ''}`}
              />
            </div>

            <div className="bg-surface-base rounded-2xl border border-border-subtle p-4 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">Sell</span>
                <button 
                  onClick={() => setAmountIn(fromBal)}
                  className="text-xs font-bold text-green-600 hover:text-green-700 transition-colors"
                >
                  Balance: {parseFloat(fromBal).toFixed(4)} {fromToken}
                </button>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                  className="text-3xl font-black text-text-primary bg-transparent outline-none w-full placeholder:text-text-muted"
                />
                <div className="bg-surface-raised rounded-xl border border-border-subtle px-3 py-1.5 flex items-center gap-2 font-bold hover:border-green-400 transition-colors cursor-pointer shadow-sm">
                  <div className={`w-2 h-2 rounded-full ${fromToken === 'BIT' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-text-primary">{fromToken}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-3 z-10 relative">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={flip}
                className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20 active:bg-green-600 transition-colors"
              >
                <ArrowUpDown size={20} />
              </motion.button>
            </div>

            <div className="bg-surface-base rounded-2xl border border-border-subtle p-4 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">Buy (Estimated)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-black w-full ${amountOut ? 'text-text-primary' : 'text-text-muted'}`}>
                  {amountOut || '0.00'}
                </div>
                <div className="bg-surface-raised rounded-xl border border-border-subtle px-3 py-1.5 flex items-center gap-2 font-bold hover:border-green-400 transition-colors cursor-pointer shadow-sm">
                  <div className={`w-2 h-2 rounded-full ${toToken === 'BIT' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-text-primary">{toToken}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-surface-base rounded-xl p-4 text-sm text-text-secondary flex flex-col gap-2 border border-border-subtle">
              <div className="flex justify-between font-medium">
                <span>Exchange Rate</span>
                <span className="text-text-primary font-bold">1 {fromToken} = {priceVal.toFixed(6)} {toToken}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Price Impact</span>
                <span className="text-green-600 font-bold">0.05%</span>
              </div>
            </div>

            <button
              onClick={doSwap}
              disabled={isSwapping || !amountIn}
              className="w-full mt-6 bg-green-500 text-white font-black text-lg py-5 rounded-2xl hover:bg-green-600 active:scale-[0.98] transition-all disabled:bg-surface-base disabled:text-text-muted disabled:cursor-not-allowed shadow-xl shadow-green-500/10 flex items-center justify-center gap-3"
            >
              {isSwapping ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  <span>Swapping...</span>
                </>
              ) : isConnected ? (
                <span>Swap {fromToken}</span>
              ) : (
                <>
                  <Wallet size={20} />
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

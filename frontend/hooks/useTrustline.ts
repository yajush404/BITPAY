'use client';
import useSWR from 'swr';
import { useState } from 'react';
import { signTransaction } from '@stellar/freighter-api';
import { Horizon, TransactionBuilder, Operation, Asset, BASE_FEE } from '@stellar/stellar-sdk';

const HORIZON_URL = process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015'; // Networks.TESTNET
const BIT_ISSUER = process.env.NEXT_PUBLIC_BIT_ISSUER || '';
// The on-chain asset is deployed as 'AGT' — the Stellar classic asset code.
// We brand it as 'BIT' in the UI but must use 'AGT' for all blockchain operations.
const ON_CHAIN_ASSET_CODE = 'AGT';

export const useTrustline = (publicKey: string) => {
  const { data, mutate, isLoading } = useSWR(
    publicKey ? `/api/balance/${publicKey}` : null,
    (url: string) => fetch(url).then((res) => res.json()),
    { refreshInterval: 5000 }
  );

  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const addTrustline = async () => {
    if (!publicKey) return;
    setIsAdding(true);
    setAddError(null);

    try {
      // 1. Load account from Horizon

      // 2. Load account from Horizon
      const server = new Horizon.Server(HORIZON_URL);
      const pkString = typeof publicKey === 'string' ? publicKey : (publicKey as any)?.address || (publicKey as any)?.publicKey || String(publicKey);
      const account = await server.loadAccount(pkString);

      // 3. Build a changeTrust transaction
      // NOTE: On-chain asset code is 'AGT' (deployed name). We brand it 'BIT' in the UI.
      const bitAsset = new Asset(ON_CHAIN_ASSET_CODE, BIT_ISSUER || account.account_id);
      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          Operation.changeTrust({
            asset: bitAsset,
            limit: '1000000', // 1M BIT limit
          })
        )
        .setTimeout(180)
        .build();

      // 4. Sign with Freighter
      const signedResult = await signTransaction(tx.toXDR(), {
        networkPassphrase: NETWORK_PASSPHRASE,
      });

      // Handle both v1 (string) and v2 ({ signedTxXdr }) return shapes
      const signedXDR: string =
        typeof signedResult === 'string'
          ? signedResult
          : (signedResult as { signedTxXdr?: string })?.signedTxXdr ?? '';

      if (!signedXDR) throw new Error('Freighter did not return a signed transaction');

      // 5. Submit to Horizon
      const signedTx = TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE);
      const response = await server.submitTransaction(signedTx);

      // 6. Refresh balance/trustline data
      await mutate();
      return (response as unknown as { hash: string }).hash;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setAddError(msg);
      console.error('[useTrustline] addTrustline failed:', msg);
      throw err;
    } finally {
      setIsAdding(false);
    }
  };

  return {
    hasTrustline: data?.hasTrustline || false,
    bitBalance: data?.bitBalance || '0',
    bitLimit: data?.bitLimit || '0',
    isLoading,
    isAdding,
    addError,
    addTrustline,
  };
};

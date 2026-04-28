import { NextResponse } from 'next/server';
import { rpc, Contract, Networks, xdr, Account, Horizon, TransactionBuilder, scValToNative } from '@stellar/stellar-sdk';

const RPC_URL = process.env.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
const POOL_CONTRACT = process.env.NEXT_PUBLIC_POOL_CONTRACT_ADDRESS || '';
const XLM_PRICE_USD = 0.12;

export async function GET() {
  try {
    if (!POOL_CONTRACT) {
      return NextResponse.json({
        tvl: '0', xlmReserve: '0', bitReserve: '0',
        volume24h: '0', apy: '12.5',
      });
    }

    const server = new rpc.Server(RPC_URL);
    const contract = new Contract(POOL_CONTRACT);

    // To simulate, we need a dummy transaction. 
    // We'll use a random source account just for the simulation.
    const sourceAccount = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
    
    // Minimal transaction for simulation
    const dummyAccount = new Account(sourceAccount, "0");
    const tx = new TransactionBuilder(dummyAccount, {
      fee: "100",
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call('get_reserves'))
      .setTimeout(0)
      .build();

    const simulation = await server.simulateTransaction(tx);

    let xlmReserve = '0';
    let bitReserve = '0';

    if (rpc.Api.isSimulationSuccess(simulation) && simulation.result) {
      const val = simulation.result.retval;
      const native = scValToNative(val);
      
      if (Array.isArray(native) && native.length >= 2) {
        bitReserve = native[0].toString();
        xlmReserve = native[1].toString();
      }
    }

    const xlmNum = parseFloat(xlmReserve) / 1e7;
    const bitNum = parseFloat(bitReserve) / 1e7;
    // Simple TVL calculation: XLM price ($0.12) + BIT price (assumed $0.05 or similar)
    const tvl = ((xlmNum * XLM_PRICE_USD) + (bitNum * 0.05)).toFixed(2);

    return NextResponse.json({
      tvl, xlmReserve, bitReserve,
      volume24h: '0', apy: '12.5',
    });
  } catch (err) {
    console.error("Pool stats error:", err);
    return NextResponse.json({
      tvl: '0', xlmReserve: '0', bitReserve: '0',
      volume24h: '0', apy: '12.5',
    });
  }
}

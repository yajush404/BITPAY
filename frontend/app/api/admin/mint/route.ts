import { NextResponse } from 'next/server';
import {
  Keypair, Asset, TransactionBuilder, Operation,
  Networks, Horizon,
} from '@stellar/stellar-sdk';

const ISSUER_SECRET = process.env.STELLAR_ISSUER_SECRET!;
const HORIZON_URL   = 'https://horizon-testnet.stellar.org';
const ADMIN_WALLETS = [
  'GBD43HIKH233XQ5K2FHCXASYP62243AUONKDRB3G2UTHK3R35PDZBXCX',
  'GCKQMQVZN5A6QMQCVKQ4SX335HLUW4N7ETXK34IOOMZOIQ2TLFF2FNLG',
  'GAV7DLBH6F3P5OU4GD3YVSZZ3DHRXGA2D6ORQBN4XSL63J4WD3H2SUSG',
];

export async function POST(req: Request) {
  try {
    const { recipient, amount, callerPubKey } = await req.json();

    // Faucet mode for testnet: anyone can request test BIT
    if (!recipient || !amount || parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
    }
    if (!ISSUER_SECRET) {
      return NextResponse.json({ error: 'Issuer key not configured' }, { status: 500 });
    }

    const issuerKp    = Keypair.fromSecret(ISSUER_SECRET);
    const bitAsset    = new Asset('BIT', issuerKp.publicKey());
    const server      = new Horizon.Server(HORIZON_URL);
    const issuerAcct  = await server.loadAccount(issuerKp.publicKey());

    // Build and sign the classic Payment transaction server-side
    const tx = new TransactionBuilder(issuerAcct, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.payment({
        destination: recipient,
        asset: bitAsset,
        amount: parseFloat(amount).toFixed(7),
      }))
      .setTimeout(180)
      .build();

    tx.sign(issuerKp);

    const result = await server.submitTransaction(tx);
    return NextResponse.json({ hash: (result as any).hash });
  } catch (err: any) {
    const detail = err?.response?.data?.extras?.result_codes || err.message;
    return NextResponse.json({ error: String(detail) }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

const HORIZON = 'https://horizon-testnet.stellar.org';
const ISSUER  = process.env.STELLAR_ISSUER_PUBLIC || process.env.NEXT_PUBLIC_BIT_ISSUER || '';

// The on-chain classic Stellar asset was deployed as 'AGT' but we brand it as 'BIT'.
// We look for BOTH codes so the user's balance shows regardless of which trustline they added.
const ASSET_CODES = ['AGT', 'BIT'];

export async function GET(
  _request: Request,
  { params }: { params: { publicKey: string } }
) {
  const { publicKey } = params;

  try {
    const res = await fetch(`${HORIZON}/accounts/${publicKey}`, { next: { revalidate: 5 } });

    if (!res.ok) {
      return NextResponse.json({ bitBalance: '0', xlmBalance: '0', hasTrustline: false, bitLimit: '0' });
    }

    const account = await res.json();
    const balances: any[] = account.balances || [];

    // XLM
    const xlmEntry = balances.find((b: any) => b.asset_type === 'native');
    const xlmBalance = xlmEntry?.balance ?? '0';

    // Look for AGT first (the real on-chain asset), then fall back to BIT trustline
    let bitEntry = balances.find(
      (b: any) => ASSET_CODES.includes(b.asset_code) && (ISSUER ? b.asset_issuer === ISSUER : true)
    );

    // Further fallback: accept any matching asset code even without issuer match
    if (!bitEntry) {
      bitEntry = balances.find((b: any) => ASSET_CODES.includes(b.asset_code));
    }

    const hasTrustline = !!bitEntry;
    // Sum AGT + BIT balances if user somehow has both
    const agtBalance = balances
      .filter((b: any) => ASSET_CODES.includes(b.asset_code) && (ISSUER ? b.asset_issuer === ISSUER : true))
      .reduce((sum: number, b: any) => sum + parseFloat(b.balance || '0'), 0);
    const bitBalance = agtBalance > 0 ? agtBalance.toFixed(7) : (bitEntry?.balance ?? '0');
    const bitLimit   = bitEntry?.limit ?? '0';

    return NextResponse.json({ bitBalance, xlmBalance, hasTrustline, bitLimit });
  } catch (err) {
    console.error('Balance route error', err);
    return NextResponse.json({ bitBalance: '0', xlmBalance: '0', hasTrustline: false, bitLimit: '0' });
  }
}

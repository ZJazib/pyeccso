// Lightweight FX helper. Fetches USD-based rates once per hour and caches
// them in localStorage. HesabPay only accepts AFN, so every donation amount
// must be converted to AFN before being sent to the payment API.

const CACHE_KEY = "pyecso.rates";
const TTL_MS = 60 * 60 * 1000; // 1 hour

// Sensible offline fallback (approximate, updated Jul 2026 order of magnitude).
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  AFN: 71,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.5,
  CHF: 0.88,
  AED: 3.67,
  SAR: 3.75,
  PKR: 278,
  INR: 83,
  TRY: 32,
  IRR: 42000,
  CNY: 7.2,
  JPY: 155,
};

let memory: { rates: Record<string, number>; ts: number } | null = null;

export async function getRates(): Promise<Record<string, number>> {
  const now = Date.now();
  if (memory && now - memory.ts < TTL_MS) return memory.rates;

  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { rates: Record<string, number>; ts: number };
        if (now - parsed.ts < TTL_MS) {
          memory = parsed;
          return parsed.rates;
        }
      }
    } catch {
      /* ignore */
    }
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch("https://open.er-api.com/v6/latest/USD", { signal: ctrl.signal });
    clearTimeout(timer);
    const json = (await res.json()) as { rates?: Record<string, number> };
    if (json?.rates && json.rates.AFN) {
      memory = { rates: json.rates, ts: now };
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(memory));
      } catch {
        /* ignore */
      }
      return json.rates;
    }
  } catch {
    /* fall through to fallback */
  }

  memory = { rates: FALLBACK_RATES, ts: now };
  return FALLBACK_RATES;
}

// Convert amount from one currency to another using USD-based rates.
export function convert(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
): number {
  const f = rates[from] ?? 1;
  const t = rates[to] ?? 1;
  if (!f || !t) return amount;
  return (amount / f) * t;
}

export function formatMoney(amount: number, currency: string, locale?: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "AFN" || currency === "JPY" || currency === "IRR" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${Math.round(amount).toLocaleString()} ${currency}`;
  }
}

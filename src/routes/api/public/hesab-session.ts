import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/hesab-session")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        try {
          const apiKey = process.env.HESABPAY_API_KEY?.trim();
          if (!apiKey) {
            return new Response(
              JSON.stringify({ error: "HesabPay is not configured yet. Please contact PYECSO." }),
              { status: 503, headers: { "Content-Type": "application/json", ...CORS } },
            );
          }

          const body = (await request.json()) as {
            amount?: number;
            email?: string;
            note?: string;
          };
          const amount = Number(body.amount);
          if (!Number.isFinite(amount) || amount < 1 || amount > 1_000_000) {
            return new Response(JSON.stringify({ error: "Invalid amount" }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...CORS },
            });
          }

          const origin = new URL(request.url).origin;
          const payload = {
            email: body.email || undefined,
            items: [
              {
                id: "pyecso-donation",
                name: body.note ? `PYECSO Donation — ${body.note}` : "PYECSO Donation",
                price: amount,
              },
            ],
            redirect_success_url: `${origin}/donate?status=success`,
            redirect_failure_url: `${origin}/donate?status=failure`,
          };

          const hesabRes = await fetch("https://api.hesab.com/api/v1/payment/create-session", {
            method: "POST",
            headers: {
              Authorization: `API-KEY ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const text = await hesabRes.text();
          if (!hesabRes.ok) {
            console.error(`HesabPay error [${hesabRes.status}]: ${text}`);
            return new Response(
              JSON.stringify({ error: "Could not create HesabPay session", details: text }),
              { status: 502, headers: { "Content-Type": "application/json", ...CORS } },
            );
          }
          const data = JSON.parse(text) as { success?: boolean; url?: string; payment_url?: string; message?: string };
          const paymentUrl = data.url ?? data.payment_url;
          if (!data.success || !paymentUrl) {
            return new Response(
              JSON.stringify({ error: data.message ?? "HesabPay did not return a payment URL" }),
              { status: 502, headers: { "Content-Type": "application/json", ...CORS } },
            );
          }
          return new Response(JSON.stringify({ payment_url: paymentUrl }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...CORS },
          });
        } catch (err) {
          console.error(err);
          return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...CORS },
          });
        }
      },
    },
  },
});

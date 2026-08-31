import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/donations/")({
  component: DonationsRedirect,
});

function DonationsRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/donate", search: { status: undefined }, replace: true });
  }, [navigate]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Redirecting to active donation appeals…</p>
      </div>
    </div>
  );
}

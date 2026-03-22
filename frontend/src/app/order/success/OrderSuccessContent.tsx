"use client";

import { useCallback, useEffect, useState } from "react";

import Phone from "@/components/Phone";
import { Button } from "@/components/ui/button";
import {
  fetchOrder,
  type OrderResponse,
} from "@/lib/api/ordersClient";

type OrderSuccessContentProps = {
  orderId: string;
  initialOrder: OrderResponse;
};

const POLL_MS = 2500;
const MAX_WAIT_MS = 90_000;

export default function OrderSuccessContent({
  orderId,
  initialOrder,
}: OrderSuccessContentProps) {
  const [order, setOrder] = useState(initialOrder);
  const [pollingStopped, setPollingStopped] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchOrder(orderId);
      setOrder(next);
    } catch {
      /* keep previous order; user can retry */
    }
  }, [orderId]);

  useEffect(() => {
    if (order.status === "paid") return;

    const started = Date.now();
    let intervalId: number | undefined;

    const tick = async () => {
      if (Date.now() - started > MAX_WAIT_MS) {
        if (intervalId !== undefined) window.clearInterval(intervalId);
        setPollingStopped(true);
        return;
      }
      try {
        const next = await fetchOrder(orderId);
        setOrder(next);
        if (next.status === "paid" && intervalId !== undefined) {
          window.clearInterval(intervalId);
        }
      } catch {
        /* network blip — keep polling until timeout */
      }
    };

    intervalId = window.setInterval(() => void tick(), POLL_MS) as number;
    void tick();

    return () => {
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [orderId, order.status]);

  const isPaid = order.status === "paid";
  const isConfirming = !isPaid && !pollingStopped;

  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-600">
          {isPaid
            ? "Payment confirmed"
            : isConfirming
              ? "Confirming payment…"
              : "Payment received"}
        </p>
        <h1 className="text-2xl font-bold text-slate-900">
          Thank you! Your SpaceCase is moving to preparation.
        </h1>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-600">
          Order #{order.orderId}
        </p>
        {isConfirming && (
          <p className="text-sm text-slate-600">
            We&apos;re confirming your payment with the bank. This usually takes
            a few seconds.
          </p>
        )}
        {pollingStopped && !isPaid && (
          <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm text-amber-900">
              Your payment is still being processed. You can refresh this page or
              check your email for confirmation.
            </p>
            <Button type="button" variant="outline" size="sm" onClick={refresh}>
              Refresh status
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="w-full md:w-[280px]">
          <Phone
            imgSrc={order.apodUrl}
            dark
            placeholderText="Your sky is waiting..."
            className="shadow-[0_40px_80px_rgba(0,0,0,0.65)] rounded-[3.5rem]"
          />
        </div>

        <div className="flex-1 space-y-3">
          <p className="font-mono text-sm font-semibold text-slate-900">
            NASA sky for {order.apodDate}
          </p>
          <p className="line-clamp-3 text-sm font-semibold leading-snug text-slate-900">
            {order.apodTitle}
          </p>
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-600">
              Delivery options
            </p>
            <p className="text-sm text-slate-700">{order.shippingOption}</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-600">
              Total paid
            </p>
            <p className="text-xl font-bold text-slate-900">
              €{order.amountEur.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-600">
        We will contact you soon with shipping and fulfilment updates.
      </p>
    </div>
  );
}

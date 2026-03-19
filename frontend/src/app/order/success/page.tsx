import Phone from "@/components/Phone";
import Container from "@/components/Container";
import { fetchOrder } from "@/lib/api/ordersClient";

type PageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export default async function OrderSuccessPage({
  searchParams,
}: PageProps) {
  const { orderId } = await searchParams;
  if (!orderId) {
    return (
      <div className="grain-dark min-h-[calc(100vh-56px)] py-10">
        <Container>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Order not found
            </h1>
            <p className="mt-2 text-slate-600">
              Missing <code>orderId</code> in the URL.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  const order = await fetchOrder(orderId);
  const isPaid = order.status === "paid";

  return (
    <div className="grain-dark min-h-[calc(100vh-56px)] py-10">
      <Container className="h-full">
        <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-600">
              {isPaid ? "Payment confirmed" : "Payment received"}
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              Thank you! Your SpaceCase is moving to preparation.
            </h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-600">
              Order #{order.orderId}
            </p>
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
            We will contact you soon with the next steps. (MVP note: production automation comes later.)
          </p>
        </div>
      </Container>
    </div>
  );
}


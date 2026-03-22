import Container from "@/components/Container";
import { fetchOrder } from "@/lib/api/ordersClient";

import OrderSuccessContent from "./OrderSuccessContent";

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

  return (
    <div className="grain-dark min-h-[calc(100vh-56px)] py-10">
      <Container className="h-full">
        <OrderSuccessContent orderId={orderId} initialOrder={order} />
      </Container>
    </div>
  );
}


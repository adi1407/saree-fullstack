import { cn } from "@/lib/utils";
import { OrderStatus } from "@/lib/types";

const LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pending Payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STYLES: Record<OrderStatus, string> = {
  pending_payment: "bg-secondary-muted text-ink",
  paid: "bg-background-alt text-primary",
  processing: "bg-secondary-muted text-ink",
  shipped: "bg-accent/10 text-accent",
  delivered: "bg-success-muted text-success",
  cancelled: "bg-background-alt text-error",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-small font-medium", STYLES[status])}>
      {LABELS[status]}
    </span>
  );
}

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  "paid",
  "processing",
  "shipped",
  "delivered",
];

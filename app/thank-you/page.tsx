import type { Metadata } from 'next';
import { OrderConfirmation } from '@/components/order-confirmation';

export const metadata: Metadata = { title: 'Thank you', robots: { index: false, follow: true } };

export default function ThankYouPage() {
  return <OrderConfirmation />;
}

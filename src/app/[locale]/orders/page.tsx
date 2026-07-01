'use client';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import { Order } from '@/types';
import { formatPrice, statusStyle } from '@/lib/utils';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { Package, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const locale = useLocale();
  const t = useTranslations('orders');
  const s = useTranslations('summary');

  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">{order.id}</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyle(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {new Date(order.createdAt).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-400">{t('itemCount', { count: order.items.length })}</p>
            <p className="font-bold text-slate-900 dark:text-white">{formatPrice(order.total, locale)}</p>
          </div>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {expanded ? t('less') : t('details')}
          </button>
        </div>
      </div>

      {/* Items preview */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-4 pt-0">
        {order.items.slice(0, 5).map(({ product, quantity }) => (
          <div key={product.id} className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
            <Image src={product.thumbnail} alt={product.title} fill className="object-cover" unoptimized />
            {quantity > 1 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                {quantity}
              </span>
            )}
          </div>
        ))}
        {order.items.length > 5 && (
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-medium text-slate-500 dark:bg-slate-700">
            +{order.items.length - 5}
          </div>
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('shippingAddress')}</h3>
              <div className="text-sm text-slate-500 dark:text-slate-400 space-y-0.5">
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{s('orderSummary')}</h3>
              <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex justify-between"><span>{s('subtotal')}</span><span>{formatPrice(order.subtotal, locale)}</span></div>
                <div className="flex justify-between"><span>{s('shipping')}</span><span>{order.shipping === 0 ? s('free') : formatPrice(order.shipping, locale)}</span></div>
                <div className="flex justify-between"><span>{s('tax')}</span><span>{formatPrice(order.tax, locale)}</span></div>
                <div className="flex justify-between font-semibold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-600 pt-1 mt-1">
                  <span>{s('total')}</span><span>{formatPrice(order.total, locale)}</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400">{t('payment', { method: order.paymentMethod })}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('items')}</h3>
            <div className="space-y-2">
              {order.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
                    <Image src={product.thumbnail} alt={product.title} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${product.id}`} className="text-sm font-medium text-slate-900 hover:text-primary-600 dark:text-slate-100 dark:hover:text-primary-400 truncate block">
                      {product.title}
                    </Link>
                  </div>
                  <span className="text-sm text-slate-400">× {quantity}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {formatPrice((product.price - (product.price * product.discountPercentage) / 100) * quantity, locale)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const t = useTranslations('orders');
  const { orders } = useOrderStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] px-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Package className="h-12 w-12 text-slate-300 dark:text-slate-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">{t('emptyTitle')}</h1>
        <p className="mb-6 text-slate-500 dark:text-slate-400">{t('emptySubtitle')}</p>
        <Link href="/products">
          <Button size="lg">
            <ShoppingBag className="h-5 w-5" />
            {t('startShopping')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('title')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('historyCount', { count: orders.length })}</p>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

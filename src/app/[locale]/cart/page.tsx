'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/store/cartStore';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Button from '@/components/ui/Button';
import { ShoppingCart, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const t = useTranslations('cart');
  const { items, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] px-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <ShoppingCart className="h-12 w-12 text-slate-300 dark:text-slate-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">{t('emptyTitle')}</h1>
        <p className="mb-6 text-slate-500 dark:text-slate-400">{t('emptySubtitle')}</p>
        <Link href="/products">
          <Button size="lg">
            <ShoppingBag className="h-5 w-5" />
            {t('browseProducts')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('title')} <span className="ml-2 text-base font-normal text-slate-400">({t('itemCount', { count: items.length })})</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:underline"
        >
          {t('clearAll')}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
          <div className="pt-2">
            <Link href="/products" className="text-sm text-primary-600 hover:underline dark:text-primary-400">
              ← {t('continueShopping')}
            </Link>
          </div>
        </div>

        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}

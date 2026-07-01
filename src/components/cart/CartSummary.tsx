'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const SHIPPING_THRESHOLD = 100;
const TAX_RATE = 0.08;

export default function CartSummary() {
  const router = useRouter();
  const t = useTranslations('summary');
  const locale = useLocale();
  const { totalPrice } = useCartStore();
  const subtotal = totalPrice();
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 9.99;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('orderSummary')}</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>{t('subtotal')}</span>
          <span>{formatPrice(subtotal, locale)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>{t('shipping')}</span>
          {shipping === 0 ? (
            <span className="text-emerald-600 dark:text-emerald-400">{t('free')}</span>
          ) : (
            <span>{formatPrice(shipping, locale)}</span>
          )}
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>{t('taxWithRate', { rate: TAX_RATE * 100 })}</span>
          <span>{formatPrice(tax, locale)}</span>
        </div>
        <div className="border-t border-slate-200 pt-2 dark:border-slate-600">
          <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
            <span>{t('total')}</span>
            <span className="text-primary-600 dark:text-primary-400">{formatPrice(total, locale)}</span>
          </div>
        </div>
      </div>

      {shipping > 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          {t('addMoreForFreeShipping', { amount: formatPrice(SHIPPING_THRESHOLD - subtotal, locale) })}
        </p>
      )}

      <Button size="lg" onClick={() => router.push('/checkout')} className="w-full">
        {t('proceedToCheckout')}
      </Button>

      <div className="mt-2 space-y-2">
        {[
          { Icon: ShieldCheck, text: t('secureCheckout') },
          { Icon: Truck, text: t('freeShippingOver', { amount: formatPrice(SHIPPING_THRESHOLD, locale) }) },
          { Icon: RefreshCw, text: t('returns30Day') },
        ].map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Icon className="h-3.5 w-3.5 text-emerald-500" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

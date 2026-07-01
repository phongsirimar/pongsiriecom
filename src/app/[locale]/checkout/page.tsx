'use client';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { ShoppingCart } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CheckoutPage() {
  const router = useRouter();
  const t = useTranslations('checkout');
  const { items } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] px-4 text-center">
        <ShoppingCart className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">{t('emptyTitle')}</h1>
        <p className="mb-6 text-slate-500 dark:text-slate-400">{t('emptySubtitle')}</p>
        <Link href="/products">
          <Button size="lg">{t('browseProducts')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('title')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('subtitle')}</p>
      </div>
      <CheckoutForm />
    </div>
  );
}

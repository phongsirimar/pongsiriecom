'use client';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, discountedPrice } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import { Heart, ShoppingCart, Trash2, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const t = useTranslations('wishlist');
  const locale = useLocale();
  const { items, remove } = useWishlistStore();
  const { addItem } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] px-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Heart className="h-12 w-12 text-slate-300 dark:text-slate-600" />
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((product) => {
          const finalPrice = discountedPrice(product.price, product.discountPercentage);
          return (
            <div key={product.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </Link>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-sm font-semibold text-slate-900 hover:text-primary-600 dark:text-slate-100 dark:hover:text-primary-400 line-clamp-2">
                    {product.title}
                  </h3>
                </Link>
                <StarRating rating={product.rating} showValue />
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{formatPrice(finalPrice, locale)}</span>
                    {product.discountPercentage > 0 && (
                      <span className="ml-1.5 text-xs text-slate-400 line-through">{formatPrice(product.price, locale)}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => { addItem(product); remove(product.id); }}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {t('addToCart')}
                  </Button>
                  <button
                    onClick={() => remove(product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-500 dark:border-slate-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

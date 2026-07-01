'use client';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { cn, formatPrice, discountedPrice, truncate, translateCategory } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const finalPrice = discountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      {/* Wishlist button */}
      <button
        onClick={() => toggle(product)}
        className={cn(
          'absolute right-3 top-3 z-10 rounded-full p-2 shadow-sm transition-all',
          wishlisted
            ? 'bg-red-500 text-white'
            : 'bg-white/90 text-slate-400 hover:text-red-500 dark:bg-slate-700/90 dark:text-slate-400'
        )}
        aria-label={t('toggleWishlist')}
      >
        <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
      </button>

      {/* Discount badge */}
      {hasDiscount && (
        <div className="absolute left-3 top-3 z-10">
          <Badge variant="danger">-{Math.round(product.discountPercentage)}%</Badge>
        </div>
      )}

      {/* Image */}
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-50 dark:bg-slate-700">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <Badge variant="info" className="mb-1.5 capitalize">{translateCategory(product.category, locale)}</Badge>
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-semibold text-slate-900 transition-colors hover:text-primary-600 dark:text-slate-100 dark:hover:text-primary-400 line-clamp-2">
              {truncate(product.title, 50)}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} showValue />
          <span className="text-xs text-slate-400">{t('inStock', { stock: product.stock })}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {formatPrice(finalPrice, locale)}
            </span>
            {hasDiscount && (
              <span className="ml-1.5 text-xs text-slate-400 line-through">
                {formatPrice(product.price, locale)}
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {t('add')}
          </button>
        </div>
      </div>
    </div>
  );
}

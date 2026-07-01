'use client';
import { use, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice, discountedPrice, translateCategory } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ShoppingCart, Heart, ChevronLeft, Plus, Minus, Package, RefreshCw, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const { id } = use(params);
  const t = useTranslations('products');
  const locale = useLocale();
  const { data: product, isLoading, isError } = useProduct(Number(id));
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="animate-pulse grid gap-8 lg:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-4">
            <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-full rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-20 w-full rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center py-20 text-slate-400">
        <p className="text-xl font-medium text-red-500">{t('productNotFound')}</p>
        <Link href="/products" className="mt-4 text-primary-600 hover:underline dark:text-primary-400">
          ← {t('backToProducts')}
        </Link>
      </div>
    );
  }

  const finalPrice = discountedPrice(product.price, product.discountPercentage);
  const wishlisted = isWishlisted(product.id);
  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
        <Link href="/products" className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400">
          <ChevronLeft className="h-4 w-4" /> {t('title')}
        </Link>
        <span>/</span>
        <span className="capitalize text-slate-600 dark:text-slate-300">{translateCategory(product.category, locale)}</span>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Image
              src={images[activeImg] || product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            {product.discountPercentage > 0 && (
              <div className="absolute left-4 top-4">
                <Badge variant="danger">-{Math.round(product.discountPercentage)}%</Badge>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-colors',
                    activeImg === i
                      ? 'border-primary-500'
                      : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                  )}
                >
                  <Image src={img} alt={`${product.title} ${i + 1}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="info" className="capitalize">{translateCategory(product.category, locale)}</Badge>
              {product.brand && <Badge variant="default">{product.brand}</Badge>}
              {product.stock <= 5 && product.stock > 0 && <Badge variant="warning">{t('onlyLeft', { stock: product.stock })}</Badge>}
              {product.stock === 0 && <Badge variant="danger">{t('outOfStock')}</Badge>}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white lg:text-3xl">{product.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} size="md" showValue />
            <span className="text-sm text-slate-400">{t('reviewsCount', { count: product.reviews?.length || 0 })}</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{formatPrice(finalPrice, locale)}</span>
            {product.discountPercentage > 0 && (
              <span className="text-lg text-slate-400 line-through">{formatPrice(product.price, locale)}</span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{product.description}</p>

          {/* Qty + Add to cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-600">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-slate-600 hover:text-primary-600 dark:text-slate-400"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center text-sm font-semibold text-slate-900 dark:text-white">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}
                className="flex h-10 w-10 items-center justify-center text-slate-600 hover:text-primary-600 dark:text-slate-400 disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              disabled={product.stock === 0}
              onClick={() => addItem(product, qty)}
            >
              <ShoppingCart className="h-5 w-5" />
              {product.stock === 0 ? t('outOfStock') : t('addToCart')}
            </Button>

            <Button
              size="icon"
              variant={wishlisted ? 'danger' : 'outline'}
              onClick={() => toggle(product)}
              aria-label={t('toggleWishlist')}
            >
              <Heart className={cn('h-5 w-5', wishlisted && 'fill-current')} />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
            {[
              { Icon: ShieldCheck, text: t('securePayment') },
              { Icon: Package, text: t('fastDelivery') },
              { Icon: RefreshCw, text: t('returns30Day') },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1 text-center">
                <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400">{text}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
            {t('customerReviews', { count: product.reviews.length })}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((review, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{review.reviewerName}</p>
                    <p className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

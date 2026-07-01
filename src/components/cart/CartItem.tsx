'use client';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, discountedPrice, translateCategory } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const locale = useLocale();
  const { updateQty, removeItem } = useCartStore();
  const { product, quantity } = item;
  const price = discountedPrice(product.price, product.discountPercentage);

  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <Link href={`/products/${product.id}`} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
        <Image src={product.thumbnail} alt={product.title} fill className="object-cover" unoptimized />
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <Link href={`/products/${product.id}`} className="text-sm font-medium text-slate-900 hover:text-primary-600 dark:text-slate-100 dark:hover:text-primary-400 line-clamp-2">
          {product.title}
        </Link>
        <span className="text-xs capitalize text-slate-400">{translateCategory(product.category, locale)}</span>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-600">
            <button
              onClick={() => quantity > 1 ? updateQty(product.id, quantity - 1) : removeItem(product.id)}
              className="flex h-7 w-7 items-center justify-center text-slate-600 hover:text-primary-600 dark:text-slate-400"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="min-w-6 text-center text-sm font-medium text-slate-900 dark:text-slate-100">
              {quantity}
            </span>
            <button
              onClick={() => updateQty(product.id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="flex h-7 w-7 items-center justify-center text-slate-600 hover:text-primary-600 dark:text-slate-400 disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-900 dark:text-white">
              {formatPrice(price * quantity, locale)}
            </span>
            <button
              onClick={() => removeItem(product.id)}
              className="text-slate-400 transition-colors hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useTranslations } from 'next-intl';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { PackageSearch } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="aspect-square bg-slate-200 dark:bg-slate-700" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-8 w-16 rounded-lg bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  const t = useTranslations('products');

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <PackageSearch className="h-16 w-16 mb-4 opacity-40" />
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400">{t('noneFound')}</p>
        <p className="text-sm">{t('adjustFilters')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

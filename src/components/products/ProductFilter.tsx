'use client';
import { useLocale, useTranslations } from 'next-intl';
import { FilterState } from '@/types';
import { useCategories } from '@/hooks/useProducts';
import { Star, SlidersHorizontal, X } from 'lucide-react';
import { cn, translateCategory } from '@/lib/utils';

interface ProductFilterProps {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
  onClose?: () => void;
}

export default function ProductFilter({ filter, onChange, onClose }: ProductFilterProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const { data: categories, isLoading } = useCategories();

  const PRICE_RANGES = [
    { label: t('anyPrice'), min: 0, max: 0 },
    { label: t('under50'), min: 0, max: 50 },
    { label: t('range50to100'), min: 50, max: 100 },
    { label: t('range100to500'), min: 100, max: 500 },
    { label: t('over500'), min: 500, max: 0 },
  ];

  const set = (partial: Partial<FilterState>) => onChange({ ...filter, ...partial });

  const activeFilters =
    (filter.category ? 1 : 0) +
    (filter.minPrice > 0 || filter.maxPrice > 0 ? 1 : 0) +
    (filter.minRating > 0 ? 1 : 0);

  return (
    <aside className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <SlidersHorizontal className="h-4 w-4" /> {t('filters')}
          {activeFilters > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
              {activeFilters}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {activeFilters > 0 && (
            <button
              onClick={() => set({ category: '', minPrice: 0, maxPrice: 0, minRating: 0 })}
              className="text-xs text-primary-600 hover:underline dark:text-primary-400"
            >
              {t('clearAll')}
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('category')}</h3>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            ))}
          </div>
        ) : (
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            <button
              onClick={() => set({ category: '' })}
              className={cn(
                'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors capitalize',
                !filter.category
                  ? 'bg-primary-50 font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
              )}
            >
              {t('allCategories')}
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => set({ category: cat.slug })}
                className={cn(
                  'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors capitalize',
                  filter.category === cat.slug
                    ? 'bg-primary-50 font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                )}
              >
                {translateCategory(cat.slug, locale)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('priceRange')}</h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const active = filter.minPrice === range.min && filter.maxPrice === range.max;
            return (
              <button
                key={range.label}
                onClick={() => set({ minPrice: range.min, maxPrice: range.max })}
                className={cn(
                  'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  active
                    ? 'bg-primary-50 font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                )}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            placeholder={t('minPricePlaceholder')}
            value={filter.minPrice || ''}
            onChange={(e) => set({ minPrice: Number(e.target.value) })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 focus:border-primary-500 focus:outline-none"
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            placeholder={t('maxPricePlaceholder')}
            value={filter.maxPrice || ''}
            onChange={(e) => set({ maxPrice: Number(e.target.value) })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 focus:border-primary-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('minRating')}</h3>
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4].map((r) => (
            <button
              key={r}
              onClick={() => set({ minRating: r })}
              className={cn(
                'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors',
                filter.minRating === r
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'border-slate-300 text-slate-600 hover:border-primary-300 dark:border-slate-600 dark:text-slate-400'
              )}
            >
              {r === 0 ? t('any') : (
                <>
                  {r}+ <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useProducts } from '@/hooks/useProducts';
import { FilterState, SortOption } from '@/types';
import SearchBar from '@/components/products/SearchBar';
import CategoryGrid from '@/components/products/CategoryGrid';
import ProductFilter from '@/components/products/ProductFilter';
import ProductSort from '@/components/products/ProductSort';
import ProductGrid from '@/components/products/ProductGrid';
import Button from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { translateCategory } from '@/lib/utils';

const DEFAULT_FILTER: FilterState = { category: '', minPrice: 0, maxPrice: 0, minRating: 0, search: '' };

export default function ProductsPage() {
  const t = useTranslations('products');
  const locale = useLocale();
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [sort, setSort] = useState<SortOption>('default');
  const [page, setPage] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, isLoading, isError } = useProducts(filter, sort, page);

  const handleFilter = (f: FilterState) => {
    setFilter(f);
    setPage(0);
  };

  const handleSearch = (search: string) => {
    setFilter((f) => ({ ...f, search }));
    setPage(0);
  };

  const handleSort = (s: SortOption) => {
    setSort(s);
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('subtitle')}</p>
        </div>
        <SearchBar value={filter.search} onChange={handleSearch} />
      </div>

      <CategoryGrid value={filter.category} onChange={(category) => handleFilter({ ...filter, category })} />

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <div className="hidden w-56 flex-shrink-0 lg:block">
          <div className="sticky top-24">
            <ProductFilter filter={filter} onChange={handleFilter} />
          </div>
        </div>

        {/* Mobile filter drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 dark:bg-slate-900">
              <ProductFilter filter={filter} onChange={handleFilter} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t('filters')}
            </button>
            <div className="ml-auto">
              <ProductSort value={sort} onChange={handleSort} total={data?.total} />
            </div>
          </div>

          {/* Active filters */}
          {(filter.category || filter.minRating > 0 || filter.minPrice > 0 || filter.maxPrice > 0) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filter.category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  {translateCategory(filter.category, locale)}
                  <button onClick={() => handleFilter({ ...filter, category: '' })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filter.minRating > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  {t('stars', { rating: filter.minRating })}
                  <button onClick={() => handleFilter({ ...filter, minRating: 0 })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(filter.minPrice > 0 || filter.maxPrice > 0) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  ${filter.minPrice} – {filter.maxPrice > 0 ? `$${filter.maxPrice}` : '∞'}
                  <button onClick={() => handleFilter({ ...filter, minPrice: 0, maxPrice: 0 })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {isError ? (
            <div className="flex flex-col items-center py-20 text-slate-400">
              <p className="text-lg font-medium text-red-500">{t('failedToLoad')}</p>
              <p className="text-sm">{t('checkConnection')}</p>
            </div>
          ) : (
            <ProductGrid products={data?.products ?? []} isLoading={isLoading} />
          )}

          {/* Pagination */}
          {!isLoading && data && data.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                {t('prev')}
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(data.totalPages, 7) }, (_, i) => {
                  const p = i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? 'bg-primary-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      {p + 1}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                {t('next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

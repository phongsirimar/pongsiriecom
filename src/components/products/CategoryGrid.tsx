'use client';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useCategories } from '@/hooks/useProducts';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { cn, translateCategory } from '@/lib/utils';
import { CATEGORY_ICONS } from '@/lib/categoryIcons';

interface CategoryGridProps {
  value: string;
  onChange: (slug: string) => void;
}

export default function CategoryGrid({ value, onChange }: CategoryGridProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const { data: categories, isLoading } = useCategories();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  // Recompute once categories render and whenever the viewport is resized,
  // since the arrows should only show when the row actually overflows.
  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isLoading, categories]);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('category')}</h2>
      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={updateScrollState}
          className="grid grid-flow-col grid-rows-2 gap-x-1 gap-y-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <CategoryTile
            active={!value}
            label={t('allCategories')}
            Icon={LayoutGrid}
            onClick={() => onChange('')}
          />

          {isLoading
            ? Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex w-20 flex-col items-center gap-2 px-1 py-2">
                  <div className="h-14 w-14 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ))
            : categories?.map((cat) => {
                const active = value === cat.slug;
                return (
                  <CategoryTile
                    key={cat.slug}
                    active={active}
                    label={translateCategory(cat.slug, locale)}
                    Icon={CATEGORY_ICONS[cat.slug] ?? LayoutGrid}
                    onClick={() => onChange(active ? '' : cat.slug)}
                  />
                );
              })}
        </div>

        {!isLoading && canScrollLeft && (
          <button
            onClick={() => scrollBy(-1)}
            aria-label="scroll left"
            className="absolute left-0 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 sm:flex"
          >
            <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>
        )}
        {!isLoading && canScrollRight && (
          <button
            onClick={() => scrollBy(1)}
            aria-label="scroll right"
            className="absolute right-0 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 sm:flex"
          >
            <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>
        )}
      </div>
    </section>
  );
}

function CategoryTile({
  active,
  label,
  Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  Icon: typeof LayoutGrid;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-20 flex-col items-center gap-2 rounded-xl px-1 py-2 text-center transition-colors',
        active ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
      )}
    >
      <span
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full transition-colors',
          active
            ? 'bg-primary-600 text-white'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <span
        className={cn(
          'line-clamp-2 text-xs leading-tight',
          active ? 'font-medium text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'
        )}
      >
        {label}
      </span>
    </button>
  );
}

'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useCategories } from '@/hooks/useProducts';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { cn, translateCategory } from '@/lib/utils';
import { CATEGORY_ICONS } from '@/lib/categoryIcons';

const COLUMNS = 10;
const ROWS = 2;
const PAGE_SIZE = COLUMNS * ROWS;

interface CategoryGridProps {
  value: string;
  onChange: (slug: string) => void;
}

interface Tile {
  slug: string;
  label: string;
  Icon: typeof LayoutGrid;
}

function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages.length ? pages : [[]];
}

export default function CategoryGrid({ value, onChange }: CategoryGridProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const { data: categories, isLoading } = useCategories();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const tiles: Tile[] = useMemo(() => {
    const allTile: Tile = { slug: '', label: t('allCategories'), Icon: LayoutGrid };
    const categoryTiles = (categories ?? []).map((cat) => ({
      slug: cat.slug,
      label: translateCategory(cat.slug, locale),
      Icon: CATEGORY_ICONS[cat.slug] ?? LayoutGrid,
    }));
    return [allTile, ...categoryTiles];
  }, [categories, locale, t]);

  const pages = useMemo(() => chunk(tiles, PAGE_SIZE), [tiles]);

  useEffect(() => {
    setPage((p) => Math.min(p, pages.length - 1));
  }, [pages.length]);

  const updatePageFromScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  };

  useEffect(() => {
    window.addEventListener('resize', updatePageFromScroll);
    return () => window.removeEventListener('resize', updatePageFromScroll);
  }, []);

  const goToPage = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(index, pages.length - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('category')}</h2>
      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={updatePageFromScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {isLoading ? (
            <div className="grid w-full flex-shrink-0 snap-start grid-cols-10 grid-rows-2 gap-x-0.5 gap-y-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 px-0.5 py-2">
                  <div className="h-7 w-7 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700 sm:h-10 sm:w-10 lg:h-14 lg:w-14" />
                  <div className="h-2 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
          ) : (
            pages.map((group, pageIndex) => (
              <div
                key={pageIndex}
                className="grid w-full flex-shrink-0 snap-start grid-cols-10 grid-rows-2 gap-x-0.5 gap-y-3"
              >
                {group.map((tile) => {
                  const active = value === tile.slug;
                  return (
                    <CategoryTile
                      key={tile.slug || 'all'}
                      active={active}
                      label={tile.label}
                      Icon={tile.Icon}
                      onClick={() => onChange(active ? '' : tile.slug)}
                    />
                  );
                })}
              </div>
            ))
          )}
        </div>

        {!isLoading && page > 0 && (
          <button
            onClick={() => goToPage(page - 1)}
            aria-label="previous categories"
            className="absolute left-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>
        )}
        {!isLoading && page < pages.length - 1 && (
          <button
            onClick={() => goToPage(page + 1)}
            aria-label="next categories"
            className="absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
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
        'flex min-w-0 flex-col items-center gap-1.5 rounded-xl px-0.5 py-2 text-center transition-colors sm:gap-2',
        active ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
      )}
    >
      <span
        className={cn(
          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors sm:h-10 sm:w-10 lg:h-14 lg:w-14',
          active
            ? 'bg-primary-600 text-white'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
        )}
      >
        <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
      </span>
      <span
        className={cn(
          'line-clamp-1 w-full text-[9px] leading-tight sm:line-clamp-2 sm:text-[11px] lg:text-xs',
          active ? 'font-medium text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'
        )}
      >
        {label}
      </span>
    </button>
  );
}

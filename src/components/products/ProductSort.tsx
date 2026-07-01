'use client';
import { useTranslations } from 'next-intl';
import { SortOption } from '@/types';
import { ArrowUpDown } from 'lucide-react';

interface ProductSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  total?: number;
}

export default function ProductSort({ value, onChange, total }: ProductSortProps) {
  const t = useTranslations('products');

  const OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'default', label: t('sortDefault') },
    { value: 'price-asc', label: t('sortPriceAsc') },
    { value: 'price-desc', label: t('sortPriceDesc') },
    { value: 'rating-desc', label: t('sortTopRated') },
    { value: 'name-asc', label: t('sortNameAsc') },
    { value: 'name-desc', label: t('sortNameDesc') },
  ];

  return (
    <div className="flex items-center gap-3">
      {total !== undefined && (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {t('resultCount', { count: total })}
        </span>
      )}
      <div className="relative flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-slate-400" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="rounded-lg border border-slate-300 bg-white py-2 pl-2 pr-8 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

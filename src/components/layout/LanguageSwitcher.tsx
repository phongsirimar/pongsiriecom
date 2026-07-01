'use client';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Languages } from 'lucide-react';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'th', label: 'TH' },
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');

  const next = LOCALES.find((l) => l.code !== locale)!;

  return (
    <button
      onClick={() => router.replace(pathname, { locale: next.code })}
      aria-label={t('toggleLanguage')}
      className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      <Languages className="h-5 w-5" />
      <span className="hidden sm:inline">{next.label}</span>
    </button>
  );
}

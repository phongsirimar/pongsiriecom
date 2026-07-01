import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Store, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');

  const shopLinks = [
    { key: 'products', label: t('shopLinks.products') },
    { key: 'categories', label: t('shopLinks.categories') },
    { key: 'newArrivals', label: t('shopLinks.newArrivals') },
    { key: 'sale', label: t('shopLinks.sale') },
  ];

  const accountLinks: { key: string; label: string; href: string }[] = [
    { key: 'login', label: t('accountLinks.login'), href: '/login' },
    { key: 'register', label: t('accountLinks.register'), href: '/register' },
    { key: 'orders', label: t('accountLinks.orders'), href: '/orders' },
    { key: 'wishlist', label: t('accountLinks.wishlist'), href: '/wishlist' },
  ];

  const supportLinks = [
    { key: 'helpCenter', label: t('supportLinks.helpCenter') },
    { key: 'contactUs', label: t('supportLinks.contactUs') },
    { key: 'privacyPolicy', label: t('supportLinks.privacyPolicy') },
    { key: 'termsOfService', label: t('supportLinks.termsOfService') },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-primary-600 dark:text-primary-400">
              <Store className="h-5 w-5" />
              <span>ShopTest</span>
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {t('tagline')}
            </p>
            <div className="mt-4 flex gap-3">
              {[Github, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="text-slate-400 transition-colors hover:text-primary-600 dark:hover:text-primary-400">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('shopHeading')}</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              {shopLinks.map((item) => (
                <li key={item.key}>
                  <Link href="/products" className="transition-colors hover:text-primary-600 dark:hover:text-primary-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('accountHeading')}</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              {accountLinks.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="transition-colors hover:text-primary-600 dark:hover:text-primary-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('supportHeading')}</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              {supportLinks.map((item) => (
                <li key={item.key}>
                  <a href="#" className="transition-colors hover:text-primary-600 dark:hover:text-primary-400">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-slate-700">
          {t('copyright', { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}

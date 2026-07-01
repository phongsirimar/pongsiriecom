'use client';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { ShoppingCart, Heart, Package, Moon, Sun, User, LogOut, Menu, X, Store } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import toast from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isDark, toggle } = useThemeStore();

  const cartCount = totalItems();
  const wishCount = wishlistItems.length;

  const navLinks = [
    { href: '/products', label: t('products') },
    { href: '/cart', label: t('cart'), count: cartCount },
    { href: '/wishlist', label: t('wishlist'), count: wishCount },
    { href: '/orders', label: t('orders') },
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast.success(tAuth('logoutToast'));
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-primary-600 dark:text-primary-400">
            <Store className="h-6 w-6" />
            <span className="text-lg">ShopNext</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label, count }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                )}
              >
                {label}
                {count !== undefined && count > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-xs text-white">
                    {count}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Icon links (mobile) */}
            <div className="flex items-center gap-1 md:hidden">
              <Link href="/cart" className="relative p-2 text-slate-600 dark:text-slate-400">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/wishlist" className="relative p-2 text-slate-600 dark:text-slate-400">
                <Heart className="h-5 w-5" />
                {wishCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {wishCount}
                  </span>
                )}
              </Link>
            </div>

            <LanguageSwitcher />

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label={t('toggleTheme')}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={user?.image} alt={user?.firstName} className="h-7 w-7 rounded-full object-cover" />
                  <span className="hidden sm:block">{user?.firstName}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    <Link
                      href="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Package className="h-4 w-4" /> {t('myOrders')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" /> {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                  <User className="h-4 w-4" /> {t('login')}
                </Button>
                <Button size="sm" onClick={() => router.push('/register')}>{t('register')}</Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-slate-200 py-3 dark:border-slate-700 md:hidden">
            {navLinks.map(({ href, label, count }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {label}
                {count !== undefined && count > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                    {count}
                  </span>
                )}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="mt-2 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { router.push('/login'); setMenuOpen(false); }}>
                  {t('login')}
                </Button>
                <Button size="sm" className="flex-1" onClick={() => { router.push('/register'); setMenuOpen(false); }}>
                  {t('register')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

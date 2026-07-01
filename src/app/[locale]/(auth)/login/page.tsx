'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Lock, User, Store, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('auth.login');
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) router.replace('/products');
  }, [isAuthenticated, router]);

  const validate = () => {
    const e = { username: '', password: '' };
    if (!username.trim()) e.username = t('usernameRequired');
    if (!password) e.password = t('passwordRequired');
    setErrors(e);
    return !e.username && !e.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await login({ username: username.trim(), password });
    if (ok) {
      toast.success(t('welcomeToast', { name: username.trim() }));
      router.push('/products');
    } else {
      toast.error(t('invalidCredentials'));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
              <Store className="h-7 w-7 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('welcomeBack')}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('signInSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              leftIcon={<User className="h-4 w-4" />}
              placeholder="emilys"
              autoComplete="username"
            />
            <Input
              label={t('password')}
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPass((v) => !v)} className="text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
              {t('signIn')}
            </Button>
          </form>

          <div className="mt-6 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">{t('demoCredentials')}</p>
            <p className="text-xs text-amber-600 dark:text-amber-300">
              {t('demoUsernameLabel')} <strong>emilys</strong> &nbsp;•&nbsp; {t('demoPasswordLabel')} <strong>emilyspass</strong>
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {t('noAccount')}{' '}
            <Link href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
              {t('signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { User, Mail, Lock, Eye, EyeOff, Store } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations('auth.register');
  const { register, isLoading, isAuthenticated } = useAuthStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', username: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) router.replace('/products');
  }, [isAuthenticated, router]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName) e.firstName = t('required');
    if (!form.lastName) e.lastName = t('required');
    if (!form.email) e.email = t('required');
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = t('invalidEmail');
    if (!form.username) e.username = t('required');
    else if (form.username.length < 3) e.username = t('minChars3');
    if (!form.password) e.password = t('required');
    else if (form.password.length < 6) e.password = t('minChars6');
    if (form.password !== form.confirm) e.confirm = t('passwordMismatch');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      username: form.username,
      password: form.password,
    });
    if (ok) {
      toast.success(t('accountCreatedToast', { name: form.firstName }));
      router.push('/products');
    } else {
      toast.error(t('usernameOrEmailExists'));
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('createAccount')}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('joinToday')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label={t('firstName')} value={form.firstName} onChange={set('firstName')} error={errors.firstName} placeholder="John" />
              <Input label={t('lastName')} value={form.lastName} onChange={set('lastName')} error={errors.lastName} placeholder="Doe" />
            </div>
            <Input
              label={t('email')}
              type="email"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              leftIcon={<Mail className="h-4 w-4" />}
              placeholder="john@example.com"
              autoComplete="email"
            />
            <Input
              label={t('username')}
              value={form.username}
              onChange={set('username')}
              error={errors.username}
              leftIcon={<User className="h-4 w-4" />}
              placeholder="johndoe"
              autoComplete="username"
            />
            <Input
              label={t('password')}
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPass((v) => !v)} className="text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <Input
              label={t('confirmPassword')}
              type={showPass ? 'text' : 'password'}
              value={form.confirm}
              onChange={set('confirm')}
              error={errors.confirm}
              leftIcon={<Lock className="h-4 w-4" />}
              placeholder="••••••••"
            />

            <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
              {t('createAccountButton')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {t('alreadyHaveAccount')}{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
              {t('signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

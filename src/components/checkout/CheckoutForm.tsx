'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import { ShippingAddress } from '@/types';
import { generateOrderId, formatPrice } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { CreditCard, Banknote, CheckCircle2 } from 'lucide-react';

const TAX_RATE = 0.08;
const SHIPPING_THRESHOLD = 100;

type PayMethod = 'card' | 'cash';

export default function CheckoutForm() {
  const router = useRouter();
  const t = useTranslations('checkout');
  const s = useTranslations('summary');
  const locale = useLocale();
  const { items, totalPrice, clearCart } = useCartStore();
  const { placeOrder } = useOrderStore();
  const { user } = useAuthStore();
  const [payMethod, setPayMethod] = useState<PayMethod>('card');
  const [isPlacing, setIsPlacing] = useState(false);

  const subtotal = totalPrice();
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 9.99;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const [address, setAddress] = useState<ShippingAddress>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  const validate = (): boolean => {
    const e: Partial<ShippingAddress> = {};
    if (!address.firstName) e.firstName = t('required');
    if (!address.lastName) e.lastName = t('required');
    if (!address.email) e.email = t('required');
    if (!address.phone) e.phone = t('required');
    if (!address.address) e.address = t('required');
    if (!address.city) e.city = t('required');
    if (!address.state) e.state = t('required');
    if (!address.zipCode) e.zipCode = t('required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const set = (k: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setAddress((a) => ({ ...a, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsPlacing(true);
    await new Promise((r) => setTimeout(r, 1200));

    placeOrder({
      id: generateOrderId(),
      items,
      subtotal,
      shipping,
      tax,
      total,
      status: 'pending',
      shippingAddress: address,
      paymentMethod: payMethod === 'card' ? t('creditCard') : t('cashOnDelivery'),
      createdAt: new Date().toISOString(),
    });
    clearCart();
    setIsPlacing(false);
    toast.success(t('orderPlaced'));
    router.push('/orders');
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-5">
      {/* Left: form */}
      <div className="space-y-6 lg:col-span-3">
        {/* Shipping info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">{t('shippingInfo')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t('firstName')} value={address.firstName} onChange={set('firstName')} error={errors.firstName} />
            <Input label={t('lastName')} value={address.lastName} onChange={set('lastName')} error={errors.lastName} />
            <Input label={t('email')} type="email" value={address.email} onChange={set('email')} error={errors.email} />
            <Input label={t('phone')} type="tel" value={address.phone} onChange={set('phone')} error={errors.phone} placeholder="+1 (555) 000-0000" />
            <div className="sm:col-span-2">
              <Input label={t('address')} value={address.address} onChange={set('address')} error={errors.address} placeholder={t('addressPlaceholder')} />
            </div>
            <Input label={t('city')} value={address.city} onChange={set('city')} error={errors.city} />
            <Input label={t('state')} value={address.state} onChange={set('state')} error={errors.state} />
            <Input label={t('zipCode')} value={address.zipCode} onChange={set('zipCode')} error={errors.zipCode} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('country')}</label>
              <select
                value={address.country}
                onChange={set('country')}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="US">{t('countries.us')}</option>
                <option value="GB">{t('countries.gb')}</option>
                <option value="TH">{t('countries.th')}</option>
                <option value="AU">{t('countries.au')}</option>
                <option value="CA">{t('countries.ca')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">{t('paymentMethod')}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              { id: 'card', label: t('creditCard'), Icon: CreditCard },
              { id: 'cash', label: t('cashOnDelivery'), Icon: Banknote },
            ] as { id: PayMethod; label: string; Icon: React.ElementType }[]).map(({ id, label, Icon }) => (
              <label
                key={id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                  payMethod === id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-600'
                }`}
              >
                <input type="radio" name="payment" value={id} checked={payMethod === id} onChange={() => setPayMethod(id)} className="hidden" />
                <Icon className={`h-5 w-5 ${payMethod === id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`} />
                <span className={`text-sm font-medium ${payMethod === id ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {label}
                </span>
              </label>
            ))}
          </div>
          {payMethod === 'card' && (
            <div className="mt-4 grid gap-4">
              <Input label={t('cardNumber')} placeholder="4242 4242 4242 4242" />
              <div className="grid grid-cols-2 gap-4">
                <Input label={t('expiry')} placeholder="MM / YY" />
                <Input label={t('cvc')} placeholder="123" />
              </div>
              <p className="text-xs text-slate-400">{t('demoNotice')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: summary */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">{s('orderSummary')}</h2>
          <div className="max-h-52 overflow-y-auto space-y-3 mb-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3 text-sm">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.thumbnail} alt={product.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{product.title}</p>
                  <p className="text-slate-400">× {quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-600">
            <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>{s('subtotal')}</span><span>{formatPrice(subtotal, locale)}</span></div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>{s('shipping')}</span><span>{shipping === 0 ? s('free') : formatPrice(shipping, locale)}</span></div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>{s('tax')}</span><span>{formatPrice(tax, locale)}</span></div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-600 pt-2">
              <span>{s('total')}</span>
              <span className="text-primary-600 dark:text-primary-400">{formatPrice(total, locale)}</span>
            </div>
          </div>

          <Button type="submit" isLoading={isPlacing} size="lg" className="mt-6 w-full">
            <CheckCircle2 className="h-5 w-5" />
            {isPlacing ? t('placingOrder') : t('placeOrder')}
          </Button>
        </div>
      </div>
    </form>
  );
}

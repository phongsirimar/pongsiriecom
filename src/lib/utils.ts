import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const USD_TO_THB_RATE = 33;

export function formatPrice(price: number, locale: string = 'en'): string {
  if (locale === 'th') {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(
      price * USD_TO_THB_RATE
    );
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

export function discountedPrice(price: number, pct: number): number {
  return price - (price * pct) / 100;
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max) + '...';
}

export function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function statusStyle(status: string): string {
  const map: Record<string, string> = {
    pending: 'text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300',
    processing: 'text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300',
    shipped: 'text-violet-700 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-300',
    delivered: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300',
    cancelled: 'text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-300',
  };
  return map[status] ?? map.pending;
}

// DummyJSON returns a fixed set of category slugs with English-only names.
// Since there's no translated category endpoint, we maintain the Thai labels ourselves.
const CATEGORY_LABELS: Record<string, { en: string; th: string }> = {
  beauty: { en: 'Beauty', th: 'ความงาม' },
  fragrances: { en: 'Fragrances', th: 'น้ำหอม' },
  furniture: { en: 'Furniture', th: 'เฟอร์นิเจอร์' },
  groceries: { en: 'Groceries', th: 'ของชำ' },
  'home-decoration': { en: 'Home Decoration', th: 'ของแต่งบ้าน' },
  'kitchen-accessories': { en: 'Kitchen Accessories', th: 'อุปกรณ์ในครัว' },
  laptops: { en: 'Laptops', th: 'แล็ปท็อป' },
  'mens-shirts': { en: 'Mens Shirts', th: 'เสื้อผู้ชาย' },
  'mens-shoes': { en: 'Mens Shoes', th: 'รองเท้าผู้ชาย' },
  'mens-watches': { en: 'Mens Watches', th: 'นาฬิกาผู้ชาย' },
  'mobile-accessories': { en: 'Mobile Accessories', th: 'อุปกรณ์เสริมมือถือ' },
  motorcycle: { en: 'Motorcycle', th: 'รถจักรยานยนต์' },
  'skin-care': { en: 'Skin Care', th: 'ผลิตภัณฑ์บำรุงผิว' },
  smartphones: { en: 'Smartphones', th: 'สมาร์ทโฟน' },
  'sports-accessories': { en: 'Sports Accessories', th: 'อุปกรณ์กีฬา' },
  sunglasses: { en: 'Sunglasses', th: 'แว่นกันแดด' },
  tablets: { en: 'Tablets', th: 'แท็บเล็ต' },
  tops: { en: 'Tops', th: 'เสื้อผู้หญิง' },
  vehicle: { en: 'Vehicle', th: 'ยานพาหนะ' },
  'womens-bags': { en: 'Womens Bags', th: 'กระเป๋าผู้หญิง' },
  'womens-dresses': { en: 'Womens Dresses', th: 'ชุดเดรสผู้หญิง' },
  'womens-jewellery': { en: 'Womens Jewellery', th: 'เครื่องประดับผู้หญิง' },
  'womens-shoes': { en: 'Womens Shoes', th: 'รองเท้าผู้หญิง' },
  'womens-watches': { en: 'Womens Watches', th: 'นาฬิกาผู้หญิง' },
};

export function translateCategory(slug: string, locale: string = 'en'): string {
  const entry = CATEGORY_LABELS[slug];
  if (!entry) return slug;
  return locale === 'th' ? entry.th : entry.en;
}

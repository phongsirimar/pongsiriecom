import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md';
  showValue?: boolean;
}

export default function StarRating({ rating, max = 5, size = 'sm', showValue = false }: StarRatingProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';

  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            starSize,
            i < Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : i < rating
              ? 'fill-amber-200 text-amber-400'
              : 'fill-slate-200 text-slate-300 dark:fill-slate-600 dark:text-slate-500'
          )}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}

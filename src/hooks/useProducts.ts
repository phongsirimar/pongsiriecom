import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Product, ProductsResponse, Category, FilterState, SortOption } from '@/types';
import { discountedPrice } from '@/lib/utils';

const PAGE_SIZE = 12;

function applySortAndFilter(products: Product[], filter: FilterState, sort: SortOption) {
  let result = [...products];

  if (filter.minPrice > 0) result = result.filter((p) => p.price >= filter.minPrice);
  if (filter.maxPrice > 0) result = result.filter((p) => p.price <= filter.maxPrice);
  if (filter.minRating > 0) result = result.filter((p) => p.rating >= filter.minRating);

  switch (sort) {
    case 'price-asc':
      result.sort((a, b) => discountedPrice(a.price, a.discountPercentage) - discountedPrice(b.price, b.discountPercentage));
      break;
    case 'price-desc':
      result.sort((a, b) => discountedPrice(b.price, b.discountPercentage) - discountedPrice(a.price, a.discountPercentage));
      break;
    case 'rating-desc':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'name-asc':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      result.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }
  return result;
}

export function useProducts(filter: FilterState, sort: SortOption, page = 0) {
  return useQuery({
    queryKey: ['products', filter, sort, page],
    queryFn: async () => {
      const skip = page * PAGE_SIZE;
      let url: string;

      if (filter.search) {
        url = `/products/search?q=${encodeURIComponent(filter.search)}&limit=100&skip=0`;
      } else if (filter.category) {
        url = `/products/category/${filter.category}?limit=100&skip=0`;
      } else {
        url = `/products?limit=100&skip=0`;
      }

      const { data } = await api.get<ProductsResponse>(url);
      const sorted = applySortAndFilter(data.products, filter, sort);
      const paginated = sorted.slice(skip, skip + PAGE_SIZE);

      return { products: paginated, total: sorted.length, page, totalPages: Math.ceil(sorted.length / PAGE_SIZE) };
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get<Product>(`/products/${id}`);
      return data;
    },
    enabled: id > 0,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/products/categories');
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });
}

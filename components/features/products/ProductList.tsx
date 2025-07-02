"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Product } from "@/types";
import { fetchProducts, fetchCategoryProducts } from "@/utils/api";
import { SearchBar } from "./SearchBar";
import { ProductCard } from "./ProductCard";
import { Loader2, AlertCircle, Package } from "lucide-react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

interface SearchFilters {
  query: string;
  minPrice: number | null;
  maxPrice: number | null;
  category: string;
  sortBy: string;
}

interface ProductListProps {
  categoryId?: number;
  initialProducts?: Product[];
  categories?: { id: number; name: string }[];
  onAddToCart?: (productId: number) => void;
  onShowDetails?: (productId: number) => void;
  onToggleWishlist?: (productId: number) => void;
}

export const ProductList = ({
  categoryId,
  initialProducts = [],
  categories = [],
  onAddToCart,
  onShowDetails,
  onToggleWishlist,
}: ProductListProps) => {
  const router = useRouter();
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: "",
    minPrice: null,
    maxPrice: null,
    category: "",
    sortBy: "name",
  });

  // SWR key untuk caching yang unik berdasarkan categoryId
  const swrKey = categoryId
    ? `products-category-${categoryId}`
    : "products-all";

  // Fetcher function untuk SWR
  const fetcher = useCallback(async () => {
    // Jika ada initial products dan tidak ada categoryId, gunakan initial products
    if (initialProducts.length > 0 && !categoryId) {
      return initialProducts;
    }

    if (categoryId) {
      return await fetchCategoryProducts(categoryId);
    } else {
      return await fetchProducts();
    }
  }, [categoryId, initialProducts]);

  // Menggunakan SWR untuk data fetching
  const {
    data: products = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Product[]>(swrKey, fetcher, {
    // Konfigurasi SWR
    revalidateOnFocus: false, // Tidak revalidate saat window focus
    revalidateOnReconnect: true, // Revalidate saat reconnect
    dedupingInterval: 60000, // Dedupe requests dalam 1 menit
    errorRetryCount: 3, // Retry 3 kali jika error
    errorRetryInterval: 1000, // Interval retry 1 detik
    fallbackData: initialProducts.length > 0 ? initialProducts : [], // Fallback data
  });

  // Memoize filtered products untuk menghindari re-calculation yang tidak perlu
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    let filtered = [...products];

    // Filter by search query
    if (currentFilters.query.trim()) {
      const query = currentFilters.query.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.name.toLowerCase().includes(query),
      );
    }

    // Filter by price range
    if (currentFilters.minPrice !== null) {
      filtered = filtered.filter(
        (product) => product.price >= currentFilters.minPrice!,
      );
    }
    if (currentFilters.maxPrice !== null) {
      filtered = filtered.filter(
        (product) => product.price <= currentFilters.maxPrice!,
      );
    }

    // Filter by category
    if (currentFilters.category && currentFilters.category !== "") {
      filtered = filtered.filter(
        (product) => product.category.name === currentFilters.category,
      );
    }

    // Sort products
    switch (currentFilters.sortBy) {
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "popular":
        filtered.sort((a, b) => a.id - b.id);
        break;
      default:
        break;
    }

    return filtered;
  }, [products, currentFilters]);

  // Handle search filters change
  const handleSearch = useCallback((filters: SearchFilters) => {
    setCurrentFilters(filters);
  }, []);

  // Handle product actions
  const handleAddToCart = useCallback(
    (productId: number) => {
      onAddToCart?.(productId);
      console.log(`Added product ${productId} to cart`);
    },
    [onAddToCart],
  );

  const handleShowDetails = useCallback(
    (productId: number) => {
      // Jika ada custom handler, gunakan itu
      if (onShowDetails) {
        onShowDetails(productId);
      } else {
        // Default behavior: navigate ke halaman detail produk
        router.push(`/products/${productId}`);
      }
      console.log(`Show details for product ${productId}`);
    },
    [onShowDetails, router],
  );

  const handleToggleWishlist = useCallback(
    (productId: number) => {
      onToggleWishlist?.(productId);
      console.log(`Toggled wishlist for product ${productId}`);
    },
    [onToggleWishlist],
  );

  // Handle retry
  const handleRetry = useCallback(() => {
    mutate(); // SWR mutate untuk refetch data
  }, [mutate]);

  // Loading state
  if (isLoading) {
    return (
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-base-content/70">Memuat produk...</p>
        </div>
      </MaxWidthWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <MaxWidthWrapper>
        <div className="alert alert-error">
          <AlertCircle className="h-5 w-5" />
          <span>Gagal memuat produk. Silakan coba lagi.</span>
          <button className="btn btn-sm btn-outline" onClick={handleRetry}>
            Coba Lagi
          </button>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper>
      <div className="w-full space-y-6 py-4">
        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          categories={categories}
          placeholder="Cari produk..."
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-base-content/70">
            Menampilkan {filteredProducts.length} dari {products.length} produk
            {currentFilters.query && (
              <span className="ml-1">
                untuk &rdquo;{currentFilters.query}&rdquo;
              </span>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRetry}
            className="btn btn-ghost btn-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Refresh"
            )}
          </button>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-base-content/30 mb-4" />
            <h3 className="text-lg font-semibold text-base-content/70 mb-2">
              Tidak ada produk ditemukan
            </h3>
            <p className="text-base-content/50 text-center max-w-md">
              {currentFilters.query ||
              currentFilters.category ||
              currentFilters.minPrice ||
              currentFilters.maxPrice
                ? "Coba ubah filter pencarian Anda atau hapus beberapa filter."
                : "Belum ada produk yang tersedia saat ini."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onShowDetails={handleShowDetails}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}

        {/* Load More Button (if needed for pagination) */}
        {/* {filteredProducts.length > 0 &&
          filteredProducts.length < products.length && (
            <div className="flex justify-center pt-6">
              <button className="btn btn-outline">Muat Lebih Banyak</button>
            </div>
          )} */}
      </div>
    </MaxWidthWrapper>
  );
};

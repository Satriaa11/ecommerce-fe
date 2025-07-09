import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { FeaturedProductsGrid } from "./FeaturesProductGrid";
import { Product, Category } from "@/types";

interface FeaturedProductsSectionProps {
  featuredProducts: Product[];
  categories: Category[];
  error: string | null;
}

export const FeaturedProductsSection = ({
  featuredProducts,
  // categories,
  error,
}: FeaturedProductsSectionProps) => {
  // Batasi hanya 15 produk yang ditampilkan
  const limitedProducts = featuredProducts.slice(0, 15);

  return (
    <div className="mb-12">
      <div className="bg-base-100 rounded-2xl p-8 shadow-sm border border-base-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-base-content mb-2">
              Featured Products
            </h2>
            <p className="text-base-content/70">
              Handpicked products just for you ({limitedProducts.length}{" "}
              products)
            </p>
          </div>
          <Link href="/products" className="btn btn-primary rounded-full">
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="text-error mb-4">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">Failed to load products</p>
              <p className="text-sm text-base-content/70">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline"
            >
              Try Again
            </button>
          </div>
        ) : limitedProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50 text-base-content/30" />
            <p className="text-lg font-semibold text-base-content/70">
              No featured products available
            </p>
          </div>
        ) : (
          <FeaturedProductsGrid products={limitedProducts} />
        )}
      </div>
    </div>
  );
};

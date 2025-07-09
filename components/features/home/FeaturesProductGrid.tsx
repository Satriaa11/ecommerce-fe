"use client";

import { Product } from "@/types";
import { ProductCard } from "@/components/features/products/ProductCard";
import { useAppStore } from "@/stores/useAppStore";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface FeaturedProductsGridProps {
  products: Product[];
}

export const FeaturedProductsGrid = ({
  products,
}: FeaturedProductsGridProps) => {
  const router = useRouter();
  const { addToCart } = useAppStore();

  // Handle add to cart
  const handleAddToCart = useCallback(
    (productId: number) => {
      try {
        const product = products.find((p) => p.id === productId);

        if (!product) {
          console.error("Product not found:", productId);
          return;
        }

        if (product.quantity !== undefined && product.quantity <= 0) {
          console.warn("Product out of stock:", product.title);
          return;
        }

        addToCart({
          id: product.id,
          name: product.title,
          price: product.price,
          quantity: 1,
          image: product.images?.[0],
          category: product.category.name,
        });

        console.log(`Added ${product.title} to cart`);
      } catch (error) {
        console.error("Failed to add product to cart:", error);
      }
    },
    [addToCart, products],
  );

  // Handle show details
  const handleShowDetails = useCallback(
    (productId: number) => {
      router.push(`/products/${productId}`);
    },
    [router],
  );

  // Handle toggle wishlist
  const handleToggleWishlist = useCallback((productId: number) => {
    console.log(`Toggled wishlist for product ${productId}`);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          onShowDetails={handleShowDetails}
          onToggleWishlist={handleToggleWishlist}
        />
      ))}
    </div>
  );
};

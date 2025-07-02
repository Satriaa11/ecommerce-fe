"use client";

import { ShoppingCart, Eye, Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  onShowDetails?: (productId: number) => void;
  onToggleWishlist?: (productId: number) => void;
}

export const ProductCard = ({
  product,
  onAddToCart,
  onShowDetails,
  onToggleWishlist,
}: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      onAddToCart?.(product.id);
      // Show success toast or feedback here
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onToggleWishlist?.(product.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-200 w-full max-w-sm mx-auto">
      {/* Image Container */}
      <figure className="relative overflow-hidden aspect-square">
        <Image
          src={product.images[0] || "/placeholder-product.jpg"}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 btn btn-circle btn-xs ${
            isWishlisted ? "btn-error text-white" : "btn-ghost bg-white/80"
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`h-3 w-3 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="badge badge-primary badge-xs text-xs px-1">
            {product.category.name}
          </span>
        </div>
      </figure>

      {/* Card Body */}
      <div className="card-body p-3 flex-1">
        {/* Title */}
        <h3 className="card-title text-sm font-semibold line-clamp-2 min-h-[2.5rem] leading-tight">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-base-content/70 line-clamp-2 min-h-[2rem] leading-relaxed">
          {product.description}
        </p>

        {/* Price and Stock */}
        <div className="flex flex-col gap-2 mt-2">
          <span className="text-base font-bold text-primary truncate">
            {formatPrice(product.price)}
          </span>

          {/* Stock indicator */}
          {product.quantity !== undefined && (
            <span
              className={`badge badge-xs self-start ${
                product.quantity > 0 ? "badge-success" : "badge-error"
              }`}
            >
              {product.quantity > 0 ? `Stock: ${product.quantity}` : "Habis"}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="card-actions flex-col gap-2 mt-3">
          {/* Show Details Button */}
          <button
            onClick={() => onShowDetails?.(product.id)}
            className="btn btn-outline btn-xs w-full"
          >
            <Eye className="h-3 w-3" />
            <span className="text-xs">Detail</span>
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={
              isLoading ||
              (product.quantity !== undefined && product.quantity === 0)
            }
            className={`btn btn-primary btn-xs w-full ${
              isLoading ? "loading" : ""
            }`}
          >
            {!isLoading && <ShoppingCart className="h-3 w-3" />}
            <span className="text-xs">
              {isLoading ? "Menambah..." : "Tambah"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

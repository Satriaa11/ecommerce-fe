"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ArrowLeft,
  Star,
  Truck,
  Shield,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Product } from "@/types";
import { fetchProductById } from "@/utils/api";
import { useAppStore } from "@/stores/useAppStore";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.slug as string;

  const { addToCart } = useAppStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fetch product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchProductById(parseInt(productId));
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details. Please try again.");
        console.error("Error loading product:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handle quantity change
  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (!product) return;

    setQuantity((prevQuantity) => {
      if (action === "increase") {
        const maxQuantity = product.quantity || 99;
        return Math.min(prevQuantity + 1, maxQuantity);
      } else if (action === "decrease") {
        return Math.max(prevQuantity - 1, 1);
      }
      return prevQuantity;
    });
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        quantity: quantity,
        image: product.images?.[0] || "/placeholder-product.jpg",
        category: product.category.name,
      });

      alert(`${quantity} item(s) successfully added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle wishlist toggle
  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log(`Toggled wishlist for product ${product?.id}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <MaxWidthWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </MaxWidthWrapper>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <AlertCircle className="h-16 w-16 text-error" />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-base-content mb-2">
              Product Not Found
            </h2>
            <p className="text-base-content/70 mb-4">
              {error || "The product you're looking for is not available."}
            </p>
            <div className="flex gap-2">
              <button onClick={() => router.back()} className="btn btn-outline">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
              <button
                onClick={() => router.push("/products")}
                className="btn btn-primary"
              >
                View Other Products
              </button>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    );
  }

  const isOutOfStock = product.quantity === 0;
  const totalPrice = product.price * quantity;

  return (
    <MaxWidthWrapper>
      <div className="py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <button
                onClick={() => router.push("/")}
                className="link link-hover"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/products")}
                className="link link-hover"
              >
                Products
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  router.push(`/products?category=${product.category.name}`)
                }
                className="link link-hover"
              >
                {product.category.name}
              </button>
            </li>
            <li className="text-base-content/50 truncate max-w-[200px]">
              {product.title}
            </li>
          </ul>
        </div>

        {/* Back Button */}
        <button onClick={() => router.back()} className="btn btn-ghost btn-sm">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg border border-base-200 bg-base-100">
              <Image
                src={
                  product.images?.[selectedImageIndex] ||
                  product.images?.[0] ||
                  "/placeholder-product.jpg"
                }
                alt={product.title}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-product.jpg";
                }}
              />
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    title={`View image ${index + 1} of ${product.title}`}
                    className={`aspect-square relative overflow-hidden rounded border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-base-200 hover:border-base-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder-product.jpg"}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-product.jpg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className="badge badge-primary badge-sm">
                {product.category.name}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-base-content">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-base-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-base-content/70">
                (4.0) • 128 reviews
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </div>
                {quantity > 1 && (
                  <div className="text-lg font-semibold text-base-content">
                    Total: {formatPrice(totalPrice)}
                  </div>
                )}
              </div>
              {quantity > 1 && (
                <div className="text-sm text-base-content/70">
                  {quantity} × {formatPrice(product.price)}
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span
                className={`badge ${
                  isOutOfStock
                    ? "badge-error"
                    : (product.quantity || 0) < 10
                      ? "badge-warning"
                      : "badge-success"
                }`}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : (product.quantity || 0) < 10
                    ? `Limited Stock: ${product.quantity}`
                    : `In Stock: ${product.quantity}`}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold">Product Description</h3>
              <p className="text-base-content/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="space-y-2">
                <label className="font-semibold">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="join">
                    <button
                      title="Decrease Quantity"
                      type="button"
                      className="btn btn-sm join-item"
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          const maxQuantity = product.quantity || 99;
                          setQuantity(Math.min(value, maxQuantity));
                        }
                      }}
                      className="input input-sm join-item w-16 text-center"
                      min="1"
                      max={product.quantity || 99}
                    />
                    <button
                      title="Increase Quantity"
                      type="button"
                      className="btn btn-sm join-item"
                      onClick={() => handleQuantityChange("increase")}
                      disabled={quantity >= (product.quantity || 99)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-base-content/70">
                    Max: {product.quantity || 99}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                  className="btn btn-primary flex-1"
                >
                  {isAddingToCart ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </>
                  )}
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`btn btn-outline ${
                    isWishlisted ? "btn-error" : "btn-ghost"
                  }`}
                  title={
                    isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              {/* Buy Now Button */}
              {!isOutOfStock && (
                <button className="btn btn-secondary w-full">Buy Now</button>
              )}
            </div>

            {/* Product Features */}
            <div className="space-y-3">
              <h3 className="font-semibold">Product Features</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Free Shipping</div>
                    <div className="text-sm text-base-content/70">
                      On orders over $50
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Warranty</div>
                    <div className="text-sm text-base-content/70">
                      1 year manufacturer warranty
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Easy Returns</div>
                    <div className="text-sm text-base-content/70">
                      30-day return policy
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Product Specifications</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <tbody>
                  <tr>
                    <td className="font-medium">Category</td>
                    <td>{product.category.name}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Product ID</td>
                    <td>#{product.id}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Availability</td>
                    <td>
                      <span
                        className={`badge ${
                          isOutOfStock ? "badge-error" : "badge-success"
                        }`}
                      >
                        {isOutOfStock ? "Out of Stock" : "In Stock"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium">Stock Quantity</td>
                    <td>{product.quantity || 0} units</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Customer Reviews</h2>

            {/* Review Summary */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold">4.0</div>
                <div className="flex items-center justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-base-300"}`}
                    />
                  ))}
                </div>
                <div className="text-sm text-base-content/70">128 reviews</div>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2 mb-1">
                    <span className="text-sm w-2">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-base-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${rating === 4 ? 60 : rating === 5 ? 30 : rating === 3 ? 8 : 2}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-base-content/70 w-8">
                      {rating === 4
                        ? 77
                        : rating === 5
                          ? 38
                          : rating === 3
                            ? 10
                            : 3}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-4">
              <div className="border-b border-base-200 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                      <span className="text-xs">JD</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">John Doe</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-base-300"}`}
                        />
                      ))}
                      <span className="text-sm text-base-content/70 ml-1">
                        2 days ago
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-base-content/80">
                  Excellent product! Great quality and fast shipping. Highly
                  recommended.
                </p>
              </div>

              <div className="border-b border-base-200 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                      <span className="text-xs">AS</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Alice Smith</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-base-300"}`}
                        />
                      ))}
                      <span className="text-sm text-base-content/70 ml-1">
                        1 week ago
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-base-content/80">
                  Good value for money. The product meets my expectations.
                </p>
              </div>
            </div>

            <button className="btn btn-outline btn-sm mt-4">
              View All Reviews
            </button>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

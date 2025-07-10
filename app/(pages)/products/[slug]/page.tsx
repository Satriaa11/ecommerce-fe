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
  CheckCircle,
  X,
} from "lucide-react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Product } from "@/types";
import { fetchProductById } from "@/utils/api";
import { useAppStore } from "@/stores/useAppStore";

interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning";
  message: string;
}

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
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast functions
  const showToast = (
    type: "success" | "error" | "warning",
    message: string,
  ) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, type, message };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

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

  // Handle add to cart with toast
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

      showToast(
        "success",
        `${quantity} ${product.title} berhasil ditambahkan ke keranjang!`,
      );
    } catch (error) {
      console.error("Failed to add to cart:", error);
      showToast("error", "Gagal menambahkan ke keranjang. Silakan coba lagi.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle wishlist toggle with toast
  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);

    if (!isWishlisted) {
      showToast("success", `${product?.title} ditambahkan ke wishlist!`);
    } else {
      showToast("warning", `${product?.title} dihapus dari wishlist!`);
    }

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
                title="View Other Products"
                type="button"
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
      {/* Toast Container */}
      <div className="toast toast-top toast-end z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`alert ${
              toast.type === "success"
                ? "alert-success"
                : toast.type === "error"
                  ? "alert-error"
                  : "alert-warning"
            } shadow-lg`}
          >
            {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
            {toast.type === "warning" && <AlertCircle className="w-5 h-5" />}
            <span className="text-sm">{toast.message}</span>
            <button
              title="Close"
              type="button"
              onClick={() => removeToast(toast.id)}
              className="btn btn-ghost btn-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <button
                title="Home"
                type="button"
                onClick={() => router.push("/")}
                className="link link-hover"
              >
                Home
              </button>
            </li>
            <li>
              <button
                title="Products"
                type="button"
                onClick={() => router.push("/products")}
                className="link link-hover"
              >
                Products
              </button>
            </li>
            <li>
              <button
                title={product.category.name}
                type="button"
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
        <button
          title="Go Back"
          type="button"
          onClick={() => router.back()}
          className="btn btn-ghost btn-sm"
        >
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
              <span className="text-sm text-base-content/70">(4.0)</span>
              <span className="text-sm text-base-content/50">
                • 128 reviews
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.price > 50 && (
                  <span className="text-lg text-base-content/50 line-through">
                    {formatPrice(product.price * 1.2)}
                  </span>
                )}
              </div>
              {product.price > 50 && (
                <span className="badge badge-success badge-sm">
                  Save {formatPrice(product.price * 0.2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isOutOfStock ? "bg-error" : "bg-success"
                }`}
              ></div>
              <span
                className={`text-sm font-medium ${
                  isOutOfStock ? "text-error" : "text-success"
                }`}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : `In Stock (${product.quantity || "Available"})`}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-base-content">Description</h3>
              <p className="text-base-content/70 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="space-y-3">
                <h3 className="font-semibold text-base-content">Quantity</h3>
                <div className="flex items-center gap-3">
                  <div className="join">
                    <button
                      title="Decrease Quantity"
                      type="button"
                      className="btn btn-outline join-item"
                      onClick={() => handleQuantityChange("decrease")}
                      // className="btn btn-outline join-item"
                      // onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        const maxQuantity = product.quantity || 99;
                        setQuantity(Math.min(Math.max(value, 1), maxQuantity));
                      }}
                      className="input input-bordered join-item w-20 text-center"
                      min="1"
                      max={product.quantity || 99}
                    />
                    <button
                      title="Increase Quantity"
                      type="button"
                      className="btn btn-outline join-item"
                      onClick={() => handleQuantityChange("increase")}
                      disabled={quantity >= (product.quantity || 99)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-base-content/70">
                    Total: {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  title="Add to Cart"
                  type="button"
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
                  title="Toggle Wishlist"
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`btn btn-outline ${
                    isWishlisted ? "btn-error" : "btn-ghost"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              {!isOutOfStock && (
                <button
                  title="Buy Now"
                  type="button"
                  onClick={handleAddToCart}
                  className="btn btn-outline w-full"
                >
                  Buy Now - {formatPrice(totalPrice)}
                </button>
              )}
            </div>

            {/* Product Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base-content">Features</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg border border-base-200">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Free Shipping</p>
                    <p className="text-xs text-base-content/70">
                      On orders over $50
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg border border-base-200">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Secure Payment</p>
                    <p className="text-xs text-base-content/70">
                      100% secure payment
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg border border-base-200">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Easy Returns</p>
                    <p className="text-xs text-base-content/70">
                      30-day return policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Product Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-base-content">
              Product Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-base-200">
                <span className="text-base-content/70">Category</span>
                <span className="font-medium">{product.category.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-base-200">
                <span className="text-base-content/70">Product ID</span>
                <span className="font-medium">#{product.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-base-200">
                <span className="text-base-content/70">Availability</span>
                <span
                  className={`font-medium ${
                    isOutOfStock ? "text-error" : "text-success"
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : "In Stock"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-base-200">
                <span className="text-base-content/70">Brand</span>
                <span className="font-medium">Premium Brand</span>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-base-content">
              Customer Reviews
            </h3>
            <div className="space-y-4">
              {/* Review Summary */}
              <div className="flex items-center gap-4 p-4 bg-base-100 rounded-lg border border-base-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">4.0</div>
                  <div className="flex items-center justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 4
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-base-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-base-content/70">
                    128 reviews
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm w-3">{star}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-base-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${star === 4 ? 60 : star === 5 ? 30 : 10}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-base-content/70 w-8">
                        {star === 4 ? "60%" : star === 5 ? "30%" : "10%"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-3">
                <div className="p-4 bg-base-100 rounded-lg border border-base-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < 5
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-base-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-sm">John D.</span>
                    <span className="text-xs text-base-content/50">
                      2 days ago
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70">
                    Excellent product! Great quality and fast shipping. Highly
                    recommended.
                  </p>
                </div>

                <div className="p-4 bg-base-100 rounded-lg border border-base-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < 4
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-base-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-sm">Sarah M.</span>
                    <span className="text-xs text-base-content/50">
                      1 week ago
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70">
                    Good value for money. The product matches the description
                    perfectly.
                  </p>
                </div>

                <div className="p-4 bg-base-100 rounded-lg border border-base-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < 3
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-base-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-sm">Mike R.</span>
                    <span className="text-xs text-base-content/50">
                      2 weeks ago
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70">
                    Decent product but shipping took longer than expected.
                    Overall satisfied.
                  </p>
                </div>
              </div>

              {/* Write Review Button */}
              <button className="btn btn-outline w-full">Write a Review</button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-base-content mb-6">
            Related Products
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Placeholder for related products */}
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow"
              >
                <figure className="aspect-square bg-base-200">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-base-content/30">
                      Related Product {item}
                    </span>
                  </div>
                </figure>
                <div className="card-body p-4">
                  <h4 className="card-title text-sm">Related Product {item}</h4>
                  <p className="text-primary font-bold">{formatPrice(29.99)}</p>
                  <div className="card-actions justify-end mt-2">
                    <button
                      className="btn btn-primary btn-sm"
                      title="Add to Cart"
                      type="button"
                    >
                      <ShoppingCart className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-base-content mb-6">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div className="collapse collapse-plus bg-base-100 border border-base-200">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title text-lg font-medium">
                What is the return policy?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/70">
                  We offer a 30-day return policy for all products. Items must
                  be in original condition with tags attached. Return shipping
                  is free for defective items.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-100 border border-base-200">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                How long does shipping take?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/70">
                  Standard shipping takes 3-5 business days. Express shipping
                  (1-2 business days) is available for an additional fee. Free
                  shipping is available on orders over $50.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-100 border border-base-200">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Is this product covered by warranty?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/70">
                  Yes, this product comes with a 1-year manufacturer warranty
                  covering defects in materials and workmanship. Extended
                  warranty options are available at checkout.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-100 border border-base-200">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Can I track my order?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/70">
                  Yes, once your order ships, you&rsquo;ll receive a tracking
                  number via email. You can track your package on our website or
                  the carrier&rsquo;s website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

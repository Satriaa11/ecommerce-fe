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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.slug as string;

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
        setError("Gagal memuat detail produk. Silakan coba lagi.");
        console.error("Error loading product:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would typically call your cart API
      console.log(`Added ${quantity} of product ${product.id} to cart`);

      // Show success message (you can implement toast here)
      alert(`${quantity} item berhasil ditambahkan ke keranjang!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Gagal menambahkan ke keranjang. Silakan coba lagi.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle wishlist toggle
  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Here you would typically call your wishlist API
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
              Produk Tidak Ditemukan
            </h2>
            <p className="text-base-content/70 mb-4">
              {error || "Produk yang Anda cari tidak tersedia."}
            </p>
            <div className="flex gap-2">
              <button onClick={() => router.back()} className="btn btn-outline">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </button>
              <button
                onClick={() => router.push("/products")}
                className="btn btn-primary"
              >
                Lihat Produk Lain
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
                Beranda
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/products")}
                className="link link-hover"
              >
                Produk
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
          Kembali
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

            {/* Rating (placeholder) */}
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
                (4.0) • 128 ulasan
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
                  ? "Stok Habis"
                  : (product.quantity || 0) < 10
                    ? `Stok Terbatas: ${product.quantity}`
                    : `Stok: ${product.quantity}`}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold">Deskripsi Produk</h3>
              <p className="text-base-content/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="space-y-2">
                <label className="font-semibold">Jumlah</label>
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
                          setQuantity(
                            Math.min(Math.max(value, 1), maxQuantity),
                          );
                        }
                      }}
                      onKeyDown={(e) => {
                        // Allow: backspace, delete, tab, escape, enter, arrow keys
                        if (
                          [8, 9, 27, 13, 37, 38, 39, 40, 46].includes(e.keyCode)
                        ) {
                          return;
                        }
                        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
                        if (
                          e.ctrlKey &&
                          [65, 67, 86, 88, 90].includes(e.keyCode)
                        ) {
                          return;
                        }
                        // Only allow numbers (0-9)
                        if (e.keyCode < 48 || e.keyCode > 57) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value);
                        if (isNaN(value) || value < 1) {
                          setQuantity(1);
                        } else {
                          const maxQuantity = product.quantity || 99;
                          const validValue = Math.min(value, maxQuantity);
                          setQuantity(validValue);
                        }
                      }}
                      onFocus={(e) => {
                        e.target.select(); // Select all text when focused
                      }}
                      className="input input-sm join-item w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      max={product.quantity || 99}
                      placeholder="1"
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
                    Maksimal {product.quantity || 99} item
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                className={`btn btn-primary flex-1 ${isAddingToCart ? "loading" : ""}`}
              >
                {!isAddingToCart && <ShoppingCart className="h-5 w-5" />}
                {isAddingToCart ? "Menambahkan..." : "Tambah ke Keranjang"}
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`btn btn-outline ${isWishlisted ? "btn-error" : ""}`}
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                />
                {isWishlisted ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
              </button>
            </div>

            {/* Product Features */}
            <div className="space-y-3">
              <h3 className="font-semibold">Keunggulan Produk</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Gratis Ongkir</div>
                    <div className="text-sm text-base-content/70">
                      Untuk pembelian minimal Rp 100.000
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Garansi Resmi</div>
                    <div className="text-sm text-base-content/70">
                      Garansi resmi 1 tahun
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Mudah Dikembalikan</div>
                    <div className="text-sm text-base-content/70">
                      Pengembalian dalam 7 hari
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Spesifikasi Produk</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <tbody>
                <tr>
                  <td className="font-medium">Kategori</td>
                  <td>{product.category.name}</td>
                </tr>
                <tr>
                  <td className="font-medium">ID Produk</td>
                  <td>#{product.id}</td>
                </tr>
                <tr>
                  <td className="font-medium">Stok Tersedia</td>
                  <td>{product.quantity || 0} unit</td>
                </tr>
                <tr>
                  <td className="font-medium">Berat</td>
                  <td>1 kg</td>
                </tr>
                <tr>
                  <td className="font-medium">Dimensi</td>
                  <td>20 x 15 x 10 cm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Ulasan Pelanggan</h3>

          {/* Review Summary */}
          <div className="bg-base-200 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-bold">4.0</div>
              <div>
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-base-300"}`}
                    />
                  ))}
                </div>
                <div className="text-sm text-base-content/70">
                  Berdasarkan 128 ulasan
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-base-300 rounded-full h-2">
                    <div
                      className={`bg-yellow-400 h-2 rounded-full ${
                        rating === 4
                          ? "w-[60%]"
                          : rating === 5
                            ? "w-[30%]"
                            : rating === 3
                              ? "w-[8%]"
                              : "w-[2%]"
                      }`}
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
            {[
              {
                name: "Ahmad S.",
                rating: 5,
                date: "2 hari yang lalu",
                comment:
                  "Produk sangat bagus, sesuai dengan deskripsi. Pengiriman cepat dan packaging rapi.",
              },
              {
                name: "Sari M.",
                rating: 4,
                date: "1 minggu yang lalu",
                comment:
                  "Kualitas produk baik, hanya saja warnanya sedikit berbeda dari foto. Overall puas.",
              },
              {
                name: "Budi T.",
                rating: 4,
                date: "2 minggu yang lalu",
                comment:
                  "Produk sesuai ekspektasi. Pelayanan seller juga responsif. Recommended!",
              },
            ].map((review, index) => (
              <div
                key={index}
                className="border border-base-200 p-4 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span className="text-xs">{review.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{review.name}</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-base-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-base-content/50">
                    {review.date}
                  </span>
                </div>
                <p className="text-sm text-base-content/80">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* View All Reviews Button */}
          <div className="text-center">
            <button className="btn btn-outline">
              Lihat Semua Ulasan (128)
            </button>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

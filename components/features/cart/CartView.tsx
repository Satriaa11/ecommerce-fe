"use client";

import { useState, useMemo } from "react";
import { CartItem } from "./CartItem";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {
  ShoppingCart,
  ArrowLeft,
  CreditCard,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItemData {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?:
    | string
    | { id: number; name: string; slug?: string; image?: string }; // Support both string and object
  maxStock?: number;
}

interface CartViewProps {
  items?: CartItemData[];
  isLoading?: boolean;
  onUpdateQuantity?: (productId: number, newQuantity: number) => Promise<void>;
  onRemoveItem?: (productId: number) => Promise<void>;
  onMoveToWishlist?: (productId: number) => Promise<void>;
  onClearCart?: () => Promise<void>;
  onCheckout?: (items: CartItemData[]) => Promise<void>;
}

export const CartView = ({
  items = [],
  isLoading = false,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist,
  onClearCart,
  onCheckout,
}: CartViewProps) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate cart summary
  const cartSummary = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal > 500000 ? 0 : 25000; // Free shipping over 500k
    const tax = subtotal * 0.11; // 11% tax
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      totalItems,
      shipping,
      tax,
      total,
    };
  }, [items]);

  const handleUpdateQuantity = async (
    productId: number,
    newQuantity: number,
  ) => {
    if (!onUpdateQuantity) return;

    try {
      await onUpdateQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // You can add toast notification here
    }
  };

  const handleRemoveItem = async (productId: number) => {
    if (!onRemoveItem) return;

    try {
      await onRemoveItem(productId);
    } catch (error) {
      console.error("Failed to remove item:", error);
      // You can add toast notification here
    }
  };

  const handleMoveToWishlist = async (productId: number) => {
    if (!onMoveToWishlist) return;

    try {
      await onMoveToWishlist(productId);
    } catch (error) {
      console.error("Failed to move to wishlist:", error);
      // You can add toast notification here
    }
  };

  const handleClearCart = async () => {
    if (!onClearCart) return;

    setIsProcessing(true);
    try {
      await onClearCart();
      setShowClearConfirm(false);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (!onCheckout || items.length === 0) return;

    setIsProcessing(true);
    try {
      await onCheckout(items);
    } catch (error) {
      console.error("Failed to checkout:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Empty cart state
  if (!isLoading && items.length === 0) {
    return (
      <MaxWidthWrapper className="py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="btn btn-ghost btn-circle"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Keranjang Belanja</h1>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
            <ShoppingCart className="h-12 w-12 text-base-content/30" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Keranjang Anda Kosong</h2>
          <p className="text-base-content/60 mb-6">
            Belum ada produk yang ditambahkan ke keranjang
          </p>
          <button onClick={() => router.push("/")} className="btn btn-primary">
            Mulai Belanja
          </button>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="btn btn-ghost btn-circle"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Keranjang Belanja</h1>
            <p className="text-base-content/60">
              {cartSummary.totalItems} item dalam keranjang
            </p>
          </div>
        </div>

        {/* Clear Cart Button */}
        {items.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="btn btn-error btn-outline btn-sm"
            disabled={isLoading || isProcessing}
          >
            <Trash2 className="h-4 w-4" />
            Kosongkan Keranjang
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading
            ? // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="card bg-base-100 shadow-sm border border-base-200"
                >
                  <div className="card-body p-4">
                    <div className="flex gap-4">
                      <div className="skeleton w-20 h-20 sm:w-24 sm:h-24 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="skeleton h-4 w-3/4"></div>
                        <div className="skeleton h-3 w-1/2"></div>
                        <div className="skeleton h-8 w-32"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onMoveToWishlist={handleMoveToWishlist}
                  isLoading={isProcessing}
                />
              ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-lg border border-base-200 sticky top-4">
            <div className="card-body p-6">
              <h2 className="card-title text-lg mb-4">Ringkasan Pesanan</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({cartSummary.totalItems} item)</span>
                  <span>{formatPrice(cartSummary.subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span
                    className={cartSummary.shipping === 0 ? "text-success" : ""}
                  >
                    {cartSummary.shipping === 0
                      ? "GRATIS"
                      : formatPrice(cartSummary.shipping)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Pajak (11%)</span>
                  <span>{formatPrice(cartSummary.tax)}</span>
                </div>

                <div className="divider my-2"></div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatPrice(cartSummary.total)}
                  </span>
                </div>
              </div>

              {/* Free shipping notice */}
              {cartSummary.shipping > 0 && (
                <div className="alert alert-info mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    Belanja {formatPrice(500000 - cartSummary.subtotal)} lagi
                    untuk gratis ongkir!
                  </span>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isLoading || isProcessing || items.length === 0}
                className={`btn btn-primary w-full mt-6 ${isProcessing ? "loading" : ""}`}
              >
                {!isProcessing && <CreditCard className="h-4 w-4" />}
                {isProcessing ? "Memproses..." : "Checkout"}
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => router.push("/")}
                className="btn btn-outline w-full mt-2"
                disabled={isProcessing}
              >
                Lanjut Belanja
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Konfirmasi Hapus</h3>
            <p className="py-4">
              Apakah Anda yakin ingin mengosongkan keranjang belanja? Semua item
              akan dihapus.
            </p>
            <div className="modal-action">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn btn-ghost"
                disabled={isProcessing}
              >
                Batal
              </button>
              <button
                onClick={handleClearCart}
                className={`btn btn-error ${isProcessing ? "loading" : ""}`}
                disabled={isProcessing}
              >
                {isProcessing ? "Menghapus..." : "Ya, Kosongkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

// Export types untuk digunakan di komponen lain
export type { CartItemData, CartViewProps };

"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, Heart, AlertTriangle } from "lucide-react";
import { CartItemData } from "./CartView";

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity?: (productId: number, newQuantity: number) => Promise<void>;
  onRemoveItem?: (productId: number) => Promise<void>;
  onMoveToWishlist?: (productId: number) => Promise<void>;
  isLoading?: boolean;
}

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist,
  isLoading = false,
}: CartItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (!onUpdateQuantity || isUpdating || isLoading) return;

    // Validasi quantity
    if (newQuantity < 1) return;
    if (item.maxStock && newQuantity > item.maxStock) return;

    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async () => {
    if (!onRemoveItem || isLoading) return;

    try {
      await onRemoveItem(item.id);
      setShowRemoveConfirm(false);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleMoveToWishlist = async () => {
    if (!onMoveToWishlist || isLoading) return;

    try {
      await onMoveToWishlist(item.id);
    } catch (error) {
      console.error("Failed to move to wishlist:", error);
    }
  };

  const totalPrice = item.price * item.quantity;
  const isQuantityAtMax = item.maxStock
    ? item.quantity >= item.maxStock
    : false;

  return (
    <>
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-4">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative overflow-hidden rounded-lg border border-base-200">
                <Image
                  src={item.image || "/placeholder-product.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-product.jpg";
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base-content truncate">
                    {item.name}
                  </h3>
                  {/* Ubah bagian ini */}
                  {item.category && (
                    <p className="text-sm text-base-content/60 mt-1">
                      {typeof item.category === "string"
                        ? item.category
                        : item.category.name}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(item.price)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-sm text-base-content/60">
                        × {item.quantity}
                      </span>
                    )}
                  </div>
                </div>

                {/* Total Price */}
                <div className="text-right">
                  <div className="text-lg font-bold text-base-content">
                    {formatPrice(totalPrice)}
                  </div>
                  {item.maxStock && item.quantity >= item.maxStock && (
                    <div className="flex items-center gap-1 text-warning text-xs mt-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Stok terbatas</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Controls and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Jumlah:</span>
                  <div className="join">
                    <button
                      onClick={() => handleQuantityChange(item.quantity - 1)}
                      disabled={item.quantity <= 1 || isUpdating || isLoading}
                      className="btn btn-sm join-item"
                      aria-label="Kurangi jumlah"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (
                          !isNaN(value) &&
                          value > 0 &&
                          value <= (item.maxStock || 99)
                        ) {
                          handleQuantityChange(value);
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value);
                        if (isNaN(value) || value < 1) {
                          e.target.value = item.quantity.toString();
                        } else if (item.maxStock && value > item.maxStock) {
                          e.target.value = item.maxStock.toString();
                          handleQuantityChange(item.maxStock);
                        }
                      }}
                      className="input input-sm join-item w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      max={item.maxStock || 99}
                      disabled={isUpdating || isLoading}
                    />
                    <button
                      onClick={() => handleQuantityChange(item.quantity + 1)}
                      disabled={isQuantityAtMax || isUpdating || isLoading}
                      className="btn btn-sm join-item"
                      aria-label="Tambah jumlah"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  {isUpdating && (
                    <span className="loading loading-spinner loading-xs"></span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {onMoveToWishlist && (
                    <button
                      onClick={handleMoveToWishlist}
                      disabled={isLoading}
                      className="btn btn-ghost btn-sm"
                      title="Pindah ke wishlist"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="hidden sm:inline">Wishlist</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowRemoveConfirm(true)}
                    disabled={isLoading}
                    className="btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content"
                    title="Hapus dari keranjang"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hapus Item</h3>
            <p className="py-4">
              Apakah Anda yakin ingin menghapus &rdquo;{item.name}&rdquo; dari
              keranjang?
            </p>
            <div className="modal-action">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="btn btn-ghost"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                onClick={handleRemoveItem}
                className="btn btn-error"
                disabled={isLoading}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

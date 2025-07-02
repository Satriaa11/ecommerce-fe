import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, Heart } from "lucide-react";

interface CartItemProps {
  item: {
    id: number;
    productId: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
    maxStock?: number;
  };
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onMoveToWishlist?: (productId: number) => void;
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (item.maxStock && newQuantity > item.maxStock) return;

    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.productId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async () => {
    setIsUpdating(true);
    try {
      await onRemoveItem(item.productId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMoveToWishlist = async () => {
    if (!onMoveToWishlist) return;

    setIsUpdating(true);
    try {
      await onMoveToWishlist(item.productId);
      await onRemoveItem(item.productId);
    } catch (error) {
      console.error("Failed to move to wishlist:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const totalPrice = item.price * item.quantity;
  const isMaxQuantity = item.maxStock ? item.quantity >= item.maxStock : false;

  return (
    <div
      className={`card bg-base-100 shadow-sm border border-base-200 ${isLoading || isUpdating ? "opacity-60" : ""}`}
    >
      <div className="card-body p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 relative overflow-hidden rounded-lg">
              <Image
                src={item.image || "/placeholder-product.jpg"}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 80px, 96px"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              {/* Title and Category */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base line-clamp-2 mb-1">
                  {item.title}
                </h3>
                <span className="badge badge-outline badge-sm">
                  {item.category}
                </span>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {formatPrice(totalPrice)}
                </div>
                <div className="text-sm text-base-content/60">
                  {formatPrice(item.price)} / item
                </div>
              </div>
            </div>

            {/* Quantity Controls and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Jumlah:</span>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdating || isLoading}
                    className="btn btn-outline btn-sm btn-square"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <div className="mx-3 min-w-[3rem] text-center">
                    <span className="font-semibold text-lg">
                      {item.quantity}
                    </span>
                    {item.maxStock && (
                      <div className="text-xs text-base-content/60">
                        / {item.maxStock}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={isMaxQuantity || isUpdating || isLoading}
                    className="btn btn-outline btn-sm btn-square"
                    aria-label="Tambah jumlah"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {isMaxQuantity && (
                  <span className="text-xs text-warning">Stok maksimal</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Move to Wishlist */}
                {onMoveToWishlist && (
                  <button
                    onClick={handleMoveToWishlist}
                    disabled={isUpdating || isLoading}
                    className="btn btn-ghost btn-sm"
                    title="Pindah ke Wishlist"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Wishlist</span>
                  </button>
                )}

                {/* Remove Item */}
                <button
                  onClick={handleRemoveItem}
                  disabled={isUpdating || isLoading}
                  className="btn btn-error btn-outline btn-sm"
                  title="Hapus dari keranjang"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Hapus</span>
                </button>
              </div>
            </div>

            {/* Loading Indicator */}
            {(isUpdating || isLoading) && (
              <div className="flex items-center gap-2 mt-2">
                <span className="loading loading-spinner loading-sm"></span>
                <span className="text-sm text-base-content/60">
                  Memperbarui...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

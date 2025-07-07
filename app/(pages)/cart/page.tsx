"use client";

import { useAppStore } from "@/stores/useAppStore";
import { CartView } from "@/components/features/cart/CartView";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateCartItemQuantity } =
    useAppStore();

  // Debug: Console log untuk melihat data cart
  console.log("Cart data:", cart);
  console.log("Cart length:", cart.length);

  const handleUpdateQuantity = async (
    productId: number,
    newQuantity: number,
  ) => {
    updateCartItemQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: number) => {
    removeFromCart(productId);
  };

  const handleClearCart = async () => {
    clearCart();
  };

  const handleCheckout = async (items: unknown[]) => {
    console.log("Checkout items:", items);
    // Implement checkout logic
  };

  return (
    <CartView
      items={cart} // Langsung pass cart dari store
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onClearCart={handleClearCart}
      onCheckout={handleCheckout}
    />
  );
}

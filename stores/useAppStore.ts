import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string; // Tambahkan avatar field
}

interface CartProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  maxStock?: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

interface AppState {
  user: User | null;
  cart: CartProduct[];
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  addToCart: (
    product: Omit<CartProduct, "quantity"> & { quantity?: number },
  ) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  clearError: () => void;
  updateProfile: (data: {
    name?: string;
    email?: string;
    avatar?: string;
  }) => Promise<void>; // Tambahkan avatar
  updatePassword: (passwordData: {
    currentPassword: string;
    password: string;
  }) => Promise<void>;
  uploadFile: (file: File) => Promise<string>; // Tambahkan uploadFile method
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          // Login request
          const loginResponse = await fetch(
            "https://api.escuelajs.co/api/v1/auth/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
            },
          );

          if (!loginResponse.ok) {
            const errorData = await loginResponse.json();
            throw new Error(errorData.message || "Login gagal");
          }

          const loginData: LoginResponse = await loginResponse.json();

          // Get user profile using access token
          const profileResponse = await fetch(
            "https://api.escuelajs.co/api/v1/auth/profile",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${loginData.access_token}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (!profileResponse.ok) {
            throw new Error("Gagal mengambil data profil");
          }

          const profileData: UserProfile = await profileResponse.json();

          // Transform profile data to match our User interface
          const user: User = {
            id: profileData.id,
            name: profileData.name,
            email: profileData.email,
            avatar: profileData.avatar, // Tambahkan avatar dari response
          };

          set({
            user,
            accessToken: loginData.access_token,
            refreshToken: loginData.refresh_token,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat login";
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          error: null,
        });
        // Cart TIDAK dikosongkan saat logout
      },

      addToCart: (item) => {
        const { cart } = get();
        const existingItem = cart.find((cartItem) => cartItem.id === item.id);

        if (existingItem) {
          // Jika produk sudah ada, tambahkan quantity
          set({
            cart: cart.map((cartItem) =>
              cartItem.id === item.id
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity + (item.quantity || 1),
                  }
                : cartItem,
            ),
          });
        } else {
          // Jika produk belum ada, tambahkan sebagai item baru
          set({
            cart: [
              ...cart,
              {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1,
                image: item.image,
              },
            ],
          });
        }
      },

      updateCartItemQuantity: (id: number, quantity: number) => {
        if (quantity <= 0) {
          // Jika quantity 0 atau negatif, hapus item
          set({
            cart: get().cart.filter((item) => item.id !== id),
          });
        } else {
          set({
            cart: get().cart.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          });
        }
      },

      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      getCartItemsCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      removeFromCart: (productId: number) => {
        const { cart } = get();
        set({
          cart: cart.filter((item) => item.id !== productId),
        });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      clearError: () => {
        set({ error: null });
      },

      // Upload file method
      uploadFile: async (file: File): Promise<string> => {
        try {
          // Validasi tipe file
          if (!file.type.startsWith("image/")) {
            throw new Error("File harus berupa gambar");
          }

          // Validasi ukuran file (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            throw new Error("Ukuran file maksimal 5MB");
          }

          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(
            "https://api.escuelajs.co/api/v1/files/upload",
            {
              method: "POST",
              body: formData,
            },
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Gagal mengunggah file");
          }

          const data = await response.json();

          // API mengembalikan object dengan property 'location'
          if (!data.location) {
            throw new Error("URL file tidak ditemukan dalam response");
          }

          return data.location;
        } catch (error) {
          console.error("Error uploading file:", error);
          throw error;
        }
      },

      updateProfile: async (data: {
        name?: string;
        email?: string;
        avatar?: string;
      }) => {
        try {
          const currentUser = get().user;
          const accessToken = get().accessToken;

          if (!currentUser?.id) {
            throw new Error("User tidak ditemukan");
          }

          if (!accessToken) {
            throw new Error(
              "Token akses tidak ditemukan. Silakan login ulang.",
            );
          }

          const response = await fetch(
            `https://api.escuelajs.co/api/v1/users/${currentUser.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(data),
            },
          );

          if (!response.ok) {
            if (response.status === 401) {
              // Token expired atau invalid
              throw new Error("Sesi telah berakhir. Silakan login ulang.");
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message || `HTTP error! status: ${response.status}`,
            );
          }

          const updatedUser = await response.json();

          // Update user di store dengan data yang baru
          set((state) => ({
            user: {
              ...state.user,
              ...updatedUser,
              // Pastikan avatar ter-update jika ada
              avatar: updatedUser.avatar || state.user?.avatar,
            },
          }));

          return updatedUser;
        } catch (error) {
          console.error("Error updating profile:", error);
          throw error;
        }
      },

      updatePassword: async (passwordData: {
        currentPassword: string;
        password: string;
      }) => {
        try {
          const currentUser = get().user;
          const accessToken = get().accessToken;

          if (!currentUser?.id) {
            throw new Error("User tidak ditemukan");
          }

          if (!accessToken) {
            throw new Error(
              "Token akses tidak ditemukan. Silakan login ulang.",
            );
          }

          const response = await fetch(
            `https://api.escuelajs.co/api/v1/users/${currentUser.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(passwordData),
            },
          );

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Sesi telah berakhir. Silakan login ulang.");
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message || `HTTP error! status: ${response.status}`,
            );
          }

          // Password berhasil diperbarui
          return;
        } catch (error) {
          console.error("Error updating password:", error);
          throw error;
        }
      },
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        user: state.user,
        cart: state.cart,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

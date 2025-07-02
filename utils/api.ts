import { Product, LoginData, SignUpData, Category } from "@/types/index";

// Parse Image URLs
const parseImageUrls = (images: string | string[]): string[] => {
  try {
    let parsedImages: string[];

    if (typeof images === "string") {
      parsedImages = JSON.parse(images);
    } else if (Array.isArray(images)) {
      parsedImages = images;
    } else {
      return [];
    }

    return parsedImages.map((url: string) => {
      url = url.replace(/^"|"$/g, "").trim();

      if (url.startsWith("https://i.imgur.com/")) {
        return url;
      }

      const fileName = url.split("/").pop() || "default.jpeg";

      return `https://i.imgur.com/${fileName}`;
    });
  } catch (e) {
    console.error("Error parsing image URLs:", e);
    return [];
  }
};

// Filter Products
const isValidTitle = (title: string): boolean => {
  return title.trim().length >= 5 && title !== "New Product";
};

const isValidImage = (imageUrl: string): boolean => {
  return !imageUrl.includes("https://i.imgur.com/any");
};

// Interface untuk filter parameters
interface ProductFilters {
  title?: string;
  price?: number;
  price_min?: number;
  price_max?: number;
  categoryId?: number;
  offset?: number;
  limit?: number;
}

// Build query string dari filter parameters
const buildQueryString = (filters: ProductFilters): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  return params.toString();
};

// Fetch all products dengan filter opsional
export const fetchProducts = async (
  filters?: ProductFilters,
): Promise<Product[]> => {
  try {
    let url = "https://api.escuelajs.co/api/v1/products";

    if (filters) {
      const queryString = buildQueryString(filters);
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Product[] = await response.json();
    const processedData = data
      .filter(
        (product) =>
          isValidTitle(product.title) &&
          product.images &&
          product.images.length > 0 &&
          isValidImage(product.images[0]),
      )
      .map((product) => ({
        ...product,
        images: parseImageUrls(product.images),
      }));

    console.log("Fetched Products:", processedData);
    return processedData;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Fetch products berdasarkan kategori ID
export const fetchCategoryProducts = async (
  categoryId: number,
  additionalFilters?: Omit<ProductFilters, "categoryId">,
): Promise<Product[]> => {
  try {
    const filters: ProductFilters = {
      categoryId,
      ...additionalFilters,
    };

    return await fetchProducts(filters);
  } catch (error) {
    console.error("Error fetching category products:", error);
    return [];
  }
};

// Fetch products berdasarkan range harga
export const fetchProductsByPriceRange = async (
  minPrice: number,
  maxPrice: number,
  additionalFilters?: Omit<ProductFilters, "price_min" | "price_max">,
): Promise<Product[]> => {
  try {
    const filters: ProductFilters = {
      price_min: minPrice,
      price_max: maxPrice,
      ...additionalFilters,
    };

    return await fetchProducts(filters);
  } catch (error) {
    console.error("Error fetching products by price range:", error);
    return [];
  }
};

// Fetch products berdasarkan title (search)
export const fetchProductsByTitle = async (
  title: string,
  additionalFilters?: Omit<ProductFilters, "title">,
): Promise<Product[]> => {
  try {
    const filters: ProductFilters = {
      title,
      ...additionalFilters,
    };

    return await fetchProducts(filters);
  } catch (error) {
    console.error("Error fetching products by title:", error);
    return [];
  }
};

// Fetch detailed product by ID
export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(
      `https://api.escuelajs.co/api/v1/products/${id}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Product = await response.json();
    return {
      ...data,
      images: parseImageUrls(data.images),
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Fetch related products by title
export const fetchRelatedProducts = async (
  title: string,
  excludeId?: number,
): Promise<Product[]> => {
  try {
    const products = await fetchProductsByTitle(title);

    // Exclude current product if excludeId is provided
    if (excludeId) {
      return products.filter((product) => product.id !== excludeId);
    }

    return products;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};

// ===== CATEGORY API FUNCTIONS =====

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch("https://api.escuelajs.co/api/v1/categories");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Category[] = await response.json();
    console.log("Fetched Categories:", data);
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Fetch category by ID
export const fetchCategoryById = async (
  id: number,
): Promise<Category | null> => {
  try {
    const response = await fetch(
      `https://api.escuelajs.co/api/v1/categories/${id}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Category = await response.json();
    console.log("Fetched Category by ID:", data);
    return data;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return null;
  }
};

// Fetch category by slug
export const fetchCategoryBySlug = async (
  slug: string,
): Promise<Category | null> => {
  try {
    const response = await fetch(
      `https://api.escuelajs.co/api/v1/categories/slug/${slug}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Category = await response.json();
    console.log("Fetched Category by Slug:", data);
    return data;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }
};

// ===== AUTHENTICATION API FUNCTIONS =====

export const postSignUp = async (userData: SignUpData): Promise<SignUpData> => {
  try {
    const response = await fetch("https://api.escuelajs.co/api/v1/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Sign Up Successful:", data);
    return data;
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
};

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export const postSignIn = async (
  userData: LoginData,
): Promise<LoginResponse> => {
  try {
    const response = await fetch("https://api.escuelajs.co/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Sign In Successful:", data);
    return data;
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

// ===== UTILITY FUNCTIONS =====

// Advanced search dengan multiple filters
export const searchProducts = async (searchParams: {
  query?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}): Promise<Product[]> => {
  try {
    const filters: ProductFilters = {};

    if (searchParams.query) {
      filters.title = searchParams.query;
    }

    if (searchParams.categoryId) {
      filters.categoryId = searchParams.categoryId;
    }

    if (searchParams.minPrice !== undefined) {
      filters.price_min = searchParams.minPrice;
    }

    if (searchParams.maxPrice !== undefined) {
      filters.price_max = searchParams.maxPrice;
    }

    if (searchParams.limit) {
      filters.limit = searchParams.limit;
    }

    if (searchParams.offset) {
      filters.offset = searchParams.offset;
    }

    return await fetchProducts(filters);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

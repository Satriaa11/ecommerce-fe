"use client";

import { useState, useEffect } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { HeroSection } from "@/components/features/home/HeroSection";
import { StatsSection } from "@/components/features/home/StatsSection";
import { CategoriesSection } from "@/components/features/home/CategoriesSection";
import { FeaturedProductsSection } from "@/components/features/home/FeaturesProductSection";
import { FeaturesSection } from "@/components/features/home/FeaturesSection";
import { NewsletterSection } from "@/components/features/home/NewsletterSection";
import { TestimonialsSection } from "@/components/features/home/TestimonialSection";
import { fetchProducts, fetchCategories } from "@/utils/api";
import { Product, Category } from "@/types";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const products = await fetchProducts();
        setFeaturedProducts(products);

        // Load categories or set mock data
        try {
          const categoriesData = await fetchCategories();
          setCategories(categoriesData.slice(0, 6));
        } catch {
          // Fallback to mock categories if API fails
          setCategories([
            {
              id: 1,
              name: "Electronics",
              image: "https://picsum.photos/300/200?random=1",
            },
            {
              id: 2,
              name: "Clothing",
              image: "https://picsum.photos/300/200?random=2",
            },
            {
              id: 3,
              name: "Home & Garden",
              image: "https://picsum.photos/300/200?random=3",
            },
            {
              id: 4,
              name: "Sports",
              image: "https://picsum.photos/300/200?random=4",
            },
            {
              id: 5,
              name: "Books",
              image: "https://picsum.photos/300/200?random=5",
            },
            {
              id: 6,
              name: "Beauty",
              image: "https://picsum.photos/300/200?random=6",
            },
          ]);
        }
      } catch (err) {
        setError("Failed to load homepage data. Please try again later.");
        console.error("Homepage data loading error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <MaxWidthWrapper>
        <HeroSection />
        <StatsSection />
        <CategoriesSection categories={categories} isLoading={isLoading} />
        <FeaturedProductsSection
          featuredProducts={featuredProducts}
          categories={categories}
          error={error}
        />
        <FeaturesSection />
        <NewsletterSection />
        <TestimonialsSection />
      </MaxWidthWrapper>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types";

interface CategoriesSectionProps {
  categories: Category[];
  isLoading: boolean;
}

export const CategoriesSection = ({
  categories,
  isLoading,
}: CategoriesSectionProps) => {
  return (
    <div className="mb-12">
      <div className="bg-base-100 rounded-2xl p-8 shadow-sm border border-base-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-base-content mb-2">
              Popular Categories
            </h2>
            <p className="text-base-content/70">
              Explore our most loved product categories
            </p>
          </div>
          <Link href="/products" className="btn btn-outline rounded-full">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="skeleton h-32 rounded-xl bg-base-300"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 5).map((category, index) => (
              <Link
                key={category.id}
                href={`/products?category=${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-xl bg-base-200 aspect-square hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://picsum.photos/300/300?random=${index + 1}`;
                  }}
                />
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <p className="font-semibold text-white text-sm drop-shadow-lg text-center">
                    {category.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

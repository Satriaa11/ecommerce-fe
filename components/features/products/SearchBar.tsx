"use client";

import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchFilters {
  query: string;
  minPrice: number | null;
  maxPrice: number | null;
  category: string;
  sortBy: string;
}

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  categories?: { id: number; name: string }[];
  placeholder?: string;
}

export const SearchBar = ({
  onSearch,
  categories = [],
  placeholder = "Search products...",
}: SearchBarProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    minPrice: null,
    maxPrice: null,
    category: "",
    sortBy: "name",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);
  const [allCategories, setAllCategories] =
    useState<{ id: number; name: string }[]>(categories);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Fetch categories if no categories from props
  useEffect(() => {
    const fetchCategories = async () => {
      if (categories.length === 0) {
        setIsLoadingCategories(true);
        try {
          const response = await fetch(
            "https://api.escuelajs.co/api/v1/categories",
          );
          const data = await response.json();
          setAllCategories(data);
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        } finally {
          setIsLoadingCategories(false);
        }
      } else {
        setAllCategories(categories);
      }
    };

    fetchCategories();
  }, [categories]);

  // Sync tempFilters with filters when filters change
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onSearch]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, query: value }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      query: filters.query,
      minPrice: null,
      maxPrice: null,
      category: "",
      sortBy: "name",
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
  };

  const hasActiveFilters =
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.category !== "" ||
    filters.sortBy !== "name";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
            <input
              type="text"
              placeholder={placeholder}
              value={filters.query}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="input input-bordered w-full pl-10 pr-4"
            />
          </div>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn btn-outline ${hasActiveFilters ? "btn-primary" : ""}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="badge badge-primary badge-sm ml-1">!</span>
          )}
        </button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.minPrice !== null && (
            <div className="badge badge-outline gap-1">
              Min: {formatPrice(filters.minPrice)}
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, minPrice: null }))
                }
                className="btn btn-ghost btn-xs p-0 h-auto min-h-0"
                title="Remove minimum price filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.maxPrice !== null && (
            <div className="badge badge-outline gap-1">
              Max: {formatPrice(filters.maxPrice)}
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, maxPrice: null }))
                }
                className="btn btn-ghost btn-xs p-0 h-auto min-h-0"
                title="Remove maximum price filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.category && (
            <div className="badge badge-outline gap-1">
              {filters.category}
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, category: "" }))
                }
                className="btn btn-ghost btn-xs p-0 h-auto min-h-0"
                title="Remove category filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.sortBy !== "name" && (
            <div className="badge badge-outline gap-1">
              Sort: {filters.sortBy}
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, sortBy: "name" }))
                }
                className="btn btn-ghost btn-xs p-0 h-auto min-h-0"
                title="Remove sort filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="card bg-base-100 shadow-lg border border-base-200">
          <div className="card-body p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="btn btn-ghost btn-xs p-0 h-auto min-h-0"
                title="Close filters"
                aria-label="Close filters"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="label label-text font-medium">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={tempFilters.minPrice || ""}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                    className="input input-bordered input-sm w-full"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={tempFilters.maxPrice || ""}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                    className="input input-bordered input-sm w-full"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="label label-text font-medium">Category</label>
                <select
                  value={tempFilters.category}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="select select-bordered select-sm w-full"
                  title="Select a category to filter products"
                  disabled={isLoadingCategories}
                >
                  <option value="">
                    {isLoadingCategories
                      ? "Loading categories..."
                      : "All Categories"}
                  </option>
                  {allCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="label label-text font-medium">Sort By</label>
                <select
                  value={tempFilters.sortBy}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value,
                    }))
                  }
                  className="select select-bordered select-sm w-full"
                  title="Select how to sort the products"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Quick Price Filters */}
            <div className="mt-4">
              <label className="label label-text font-medium">
                Quick Filters
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    setTempFilters((prev) => ({
                      ...prev,
                      minPrice: null,
                      maxPrice: 100,
                    }))
                  }
                  className="btn btn-outline btn-xs"
                >
                  Under $100
                </button>
                <button
                  onClick={() =>
                    setTempFilters((prev) => ({
                      ...prev,
                      minPrice: 100,
                      maxPrice: 500,
                    }))
                  }
                  className="btn btn-outline btn-xs"
                >
                  $100 - $500
                </button>
                <button
                  onClick={() =>
                    setTempFilters((prev) => ({
                      ...prev,
                      minPrice: 500,
                      maxPrice: null,
                    }))
                  }
                  className="btn btn-outline btn-xs"
                >
                  Above $500
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-6 pt-4 border-t border-base-200">
              <button
                onClick={handleResetFilters}
                className="btn btn-ghost btn-sm"
              >
                Reset All
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(false)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="btn btn-primary btn-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

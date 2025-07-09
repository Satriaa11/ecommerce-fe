import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="hero min-h-[70vh] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl mb-12">
      <div className="hero-content text-center">
        <div className="max-w-4xl">
          <h1 className="text-4xl lg:text-6xl font-bold text-base-content mb-6">
            Discover Amazing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Products
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
            Shop the latest trends with unbeatable prices, fast shipping, and
            exceptional customer service. Your perfect shopping experience
            starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="btn btn-primary btn-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Shopping
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="btn btn-outline btn-lg rounded-full border-base-content/20 text-base-content hover:bg-base-content hover:text-base-100"
            >
              Learn More
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

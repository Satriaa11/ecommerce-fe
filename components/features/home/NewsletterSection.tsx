import { Sparkles, Gift } from "lucide-react";

export const NewsletterSection = () => {
  return (
    <div className="mb-12">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Stay Updated with Latest Deals
          </h2>
          <p className="text-white/80 mb-6">
            Subscribe to our newsletter and get exclusive offers, new product
            updates, and special discounts delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="input input-bordered flex-1 bg-white text-base-content"
            />
            <button
              type="submit"
              className="btn btn-accent text-white border-none hover:bg-accent/90"
            >
              Subscribe
              <Gift className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-white/60 mt-3">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

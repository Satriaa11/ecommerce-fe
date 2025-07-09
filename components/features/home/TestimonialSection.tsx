import { Star } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  location: string;
}

export const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Amazing quality products and fast shipping! I've been shopping here for months and never disappointed.",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      location: "New York, USA",
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment:
        "Great customer service and competitive prices. The product quality exceeded my expectations.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      location: "Toronto, Canada",
    },
    {
      name: "Emma Wilson",
      rating: 4,
      comment:
        "Love the variety of products available. Easy to navigate website and secure checkout process.",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      location: "London, UK",
    },
  ];

  return (
    <div className="mb-12">
      <div className="bg-base-100 rounded-2xl p-8 shadow-sm border border-base-300">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-base-content mb-2">
            What Our Customers Say
          </h2>
          <p className="text-base-content/70">
            Real reviews from real customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-base-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-3 mb-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random`;
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-base-content">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-base-content/60">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-base-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-base-content/80 leading-relaxed text-center">
                &rdquo;{testimonial.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

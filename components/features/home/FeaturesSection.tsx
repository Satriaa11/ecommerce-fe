import { Truck, Shield, Clock, Zap } from "lucide-react";

interface HomePageFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

export const FeaturesSection = () => {
  const features: HomePageFeature[] = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free delivery on orders over $100",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure payment processing",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round the clock customer service",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Same day delivery available",
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="mb-12">
      <div className="bg-base-100 rounded-2xl p-8 shadow-sm border border-base-300">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-base-content mb-2">
            Why Choose Us?
          </h2>
          <p className="text-base-content/70">
            Experience the best shopping with our premium services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-base-200 to-base-300 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={`p-4 rounded-full bg-gradient-to-r ${feature.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-base-content/70">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

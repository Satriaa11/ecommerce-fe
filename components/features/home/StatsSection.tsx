import { Users, ShoppingBag, Star, Award } from "lucide-react";

interface HomePageStats {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  color: string;
}

export const StatsSection = () => {
  const stats: HomePageStats[] = [
    {
      icon: Users,
      value: "50K+",
      label: "Happy Customers",
      color: "text-primary",
    },
    {
      icon: ShoppingBag,
      value: "10K+",
      label: "Products",
      color: "text-secondary",
    },
    {
      icon: Star,
      value: "4.9",
      label: "Rating",
      color: "text-warning",
    },
    {
      icon: Award,
      value: "99%",
      label: "Satisfaction",
      color: "text-success",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-300 hover:shadow-md transition-all duration-300"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={`p-3 rounded-full bg-base-200`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-base-content">
                {stat.value}
              </p>
              <p className="text-sm text-base-content/60">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

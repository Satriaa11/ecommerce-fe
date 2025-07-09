import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Shield, Zap, Gem } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Shield,
      value: "Secure",
      label: "Safe and secure transactions",
      color: "text-success",
    },
    {
      icon: Zap,
      value: "Fast",
      label: "Quick delivery and service",
      color: "text-warning",
    },
    {
      icon: Gem,
      value: "Quality",
      label: "Premium products and service",
      color: "text-accent",
    },
  ];

  return (
    <div className="min-h-screen">
      <MaxWidthWrapper className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="hero bg-base-200 rounded-lg mb-8">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold">About Us</h1>
                <p className="py-6">
                  We are an e-commerce platform dedicated to providing the best
                  online shopping experience.
                </p>
              </div>
            </div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card bg-primary text-primary-content">
              <div className="card-body">
                <h2 className="card-title">Our Mission</h2>
                <p>
                  To provide a secure, easy-to-use platform that connects buyers
                  with quality sellers.
                </p>
              </div>
            </div>
            <div className="card bg-secondary text-secondary-content">
              <div className="card-body">
                <h2 className="card-title">Our Vision</h2>
                <p>
                  To become the leading e-commerce platform that transforms
                  online shopping experience.
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((stat, index) => (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <div className="card-body items-center text-center">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-3 rounded-full bg-base-200`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-base-content">
                          {stat.value}
                        </p>
                        <p className="text-sm text-base-content/60">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats shadow w-full">
            <div className="stat">
              <div className="stat-title">Total Users</div>
              <div className="stat-value">89,400</div>
              <div className="stat-desc">21% more than last month</div>
            </div>

            <div className="stat">
              <div className="stat-title">Total Orders</div>
              <div className="stat-value">2,100</div>
              <div className="stat-desc">↗︎ 40 (2%)</div>
            </div>

            <div className="stat">
              <div className="stat-title">Customer Satisfaction</div>
              <div className="stat-value">98%</div>
              <div className="stat-desc">↘︎ 90 (14%)</div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

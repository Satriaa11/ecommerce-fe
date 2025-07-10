import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";

const socialLinks = [
  {
    name: "GitHub",
    icon: FaGithub,
    url: "https://github.com/Satriaa11",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedinIn,
    url: "https://www.linkedin.com/in/satriawira/",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    url: "https://www.instagram.com/wiraa_11/",
  },
];

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Contact", href: "/contact" },
  { name: "FAQ", href: "/" },
];

const customerService = [
  { name: "Help Center", href: "/" },
  { name: "Returns", href: "/" },
  { name: "Shipping Info", href: "/" },
  { name: "Size Guide", href: "/" },
];

const policies = [
  { name: "Privacy Policy", href: "/" },
  { name: "Terms of Service", href: "/" },
  { name: "Cookie Policy", href: "/" },
  { name: "Refund Policy", href: "/" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 text-base-content mt-auto">
      <MaxWidthWrapper>
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  ShopEase
                </h3>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  Your trusted online shopping destination. We provide quality
                  products with excellent customer service and fast delivery.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>support@shopease.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>123 Commerce St, City, State 12345</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-base-content mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-base-content/70 hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold text-base-content mb-4">
                Customer Service
              </h4>
              <ul className="space-y-2">
                {customerService.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-base-content/70 hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Social */}
            <div>
              <h4 className="font-semibold text-base-content mb-4">Legal</h4>
              <ul className="space-y-2 mb-6">
                {policies.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-base-content/70 hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Media */}
              <div>
                <h5 className="font-medium text-base-content mb-3">
                  Follow Us
                </h5>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm btn-circle hover:btn-primary transition-colors duration-200"
                      title={`Follow us on ${social.name}`}
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-base-300 py-8">
          <div className="text-center">
            <h4 className="font-semibold text-base-content mb-2">
              Stay Updated
            </h4>
            <p className="text-sm text-base-content/70 mb-4">
              Subscribe to our newsletter for exclusive deals and updates
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered flex-1"
              />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-base-300 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-base-content/70">
              <span>© {currentYear} ShopEase. Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>by Satria Wira Bakti</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <span>Secure Payment</span>
              <div className="flex gap-2">
                <div className="badge badge-outline badge-sm">VISA</div>
                <div className="badge badge-outline badge-sm">MC</div>
                <div className="badge badge-outline badge-sm">PAYPAL</div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

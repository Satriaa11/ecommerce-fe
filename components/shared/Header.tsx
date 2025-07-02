"use client";

import { Menu, ShoppingCart, User, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MaxWidthWrapperNavbar from "@/components/MaxWidthWrapperNavbar";
import { ThemeToggle } from "../ThemeToggle";
import Image from "next/image";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  // { name: "Contact", href: "/contact" },
];

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <MaxWidthWrapperNavbar className="sticky top-4 z-50">
      <div className="navbar bg-base-100 shadow-lg rounded-lg border border-base-300">
        {/* Mobile menu */}
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-300"
            >
              {navigationItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`rounded-lg ${pathname === item.href ? "active" : ""}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <div className="divider my-2"></div>
              </li>
              <li>
                <Link href="/cart" className="rounded-lg">
                  <ShoppingCart className="h-4 w-4" />
                  Cart (3)
                </Link>
              </li>
              <li>
                <Link href="/profile" className="rounded-lg">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <button
            className="btn btn-ghost text-xl font-bold"
            onClick={() => router.push("/")}
          >
            Store
          </button>
        </div>

        {/* Desktop menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`rounded-lg ${pathname === item.href ? "active" : ""}`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side - Desktop only */}
        <div className="navbar-end gap-5 hidden lg:flex">
          {/* Search */}
          <button
            className="btn btn-ghost btn-circle"
            aria-label="Search"
            onClick={() => {
              router.push("/products");
              // Focus ke search bar setelah navigasi
              setTimeout(() => {
                const searchInput = document.querySelector(
                  'input[type="text"]',
                ) as HTMLInputElement;
                if (searchInput) {
                  searchInput.focus();
                }
              }, 100);
            }}
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Cart */}
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => router.push("/cart")}
            aria-label="Shopping cart"
          >
            <div className="indicator">
              <ShoppingCart className="h-5 w-5" />
              <span className="badge badge-sm indicator-item badge-primary">
                8
              </span>
            </div>
          </button>

          {/* Profile */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              aria-label="Profile menu"
            >
              <div className="w-10 rounded-full">
                <Image
                  alt="Profile avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-300"
            >
              <li>
                <Link href="/profile" className="justify-between">
                  Profile
                  <span className="badge badge-primary badge-sm">New</span>
                </Link>
              </li>

              <li>
                <div className="divider my-1"></div>
              </li>
              <li>
                <button
                  onClick={() => {
                    // Handle logout logic here
                    console.log("Logout clicked");
                  }}
                  className="text-error"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile right side - Only theme toggle and search */}
        <div className="navbar-end gap-1 lg:hidden">
          <button className="btn btn-ghost btn-circle" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </MaxWidthWrapperNavbar>
  );
};

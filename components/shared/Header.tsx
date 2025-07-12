"use client";

import { Menu, ShoppingCart, User, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MaxWidthWrapperNavbar from "@/components/MaxWidthWrapperNavbar";
import { ThemeToggle } from "../ThemeToggle";
import Image from "next/image";
import { useAppStore } from "@/stores/useAppStore";
import { useMemo } from "react";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  // { name: "Contact", href: "/contact" },
];

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, cart, logout } = useAppStore();

  const totalCartItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

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
                    className={`rounded-lg ${
                      pathname === item.href ? "active" : ""
                    }`}
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
                  Cart ({totalCartItems})
                </Link>
              </li>
              <li>
                {user ? (
                  <Link href="/profile" className="rounded-lg">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="rounded-lg"
                  >
                    <User className="h-4 w-4" />
                    Login
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Logo */}
          <button
            className="btn btn-ghost text-xl font-bold"
            onClick={() => router.push("/")}
          >
            ShopEase
          </button>
        </div>

        {/* Desktop menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`rounded-lg ${
                    pathname === item.href ? "active" : ""
                  }`}
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
            type="button"
            className="btn btn-ghost btn-circle"
            aria-label="Search"
            onClick={() => {
              router.push("/products");
              // Focus ke search bar setelah navigasi
              setTimeout(() => {
                const searchInput = document.querySelector(
                  'input[type="text"]'
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
            type="button"
            className={`btn btn-ghost btn-circle ${
              !user ? "btn-disabled" : ""
            }`}
            onClick={() => user && router.push("/cart")}
            aria-label="Shopping cart"
            disabled={!user}
          >
            <div className="indicator">
              <ShoppingCart className="h-5 w-5" />
              {user && totalCartItems > 0 && (
                <span className="badge badge-sm indicator-item badge-primary">
                  {totalCartItems > 99 ? "99+" : totalCartItems}
                </span>
              )}
            </div>
          </button>

          {/* Profile - Conditional rendering based on user state */}
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                aria-label="Profile menu"
              >
                <div className="w-10 rounded-full">
                  {user.avatar ? (
                    <Image
                      alt={`${user.name} avatar`}
                      src={user.avatar}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        // Fallback jika gambar gagal dimuat
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-base-300 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-base-content/50" />
                    </div>
                  )}

                  {/* Fallback icon jika gambar error */}
                  {user.avatar && (
                    <div className="w-full h-full bg-base-300 rounded-full items-center justify-center hidden">
                      <User className="w-6 h-6 text-base-content/50" />
                    </div>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-300"
              >
                <li>
                  <div className="px-4 py-2">
                    <p className="font-medium">Halo, {user.name}</p>
                    <p className="text-sm text-base-content/70">{user.email}</p>
                  </div>
                </li>
                <li>
                  <div className="divider my-1"></div>
                </li>
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
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <button
              title="Login"
              type="button"
              onClick={() => router.push("/login")}
              className="btn btn-ghost btn-circle"
              aria-label="Login"
            >
              <User className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Mobile right side - Only theme toggle and search */}
        <div className="navbar-end gap-1 lg:hidden">
          <button
            type="button"
            className="btn btn-ghost btn-circle"
            aria-label="Search"
            onClick={() => {
              router.push("/products");
              // Focus ke search bar setelah navigasi
              setTimeout(() => {
                const searchInput = document.querySelector(
                  'input[type="text"]'
                ) as HTMLInputElement;
                if (searchInput) {
                  searchInput.focus();
                }
              }, 100);
            }}
          >
            <Search className="h-5 w-5" />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </MaxWidthWrapperNavbar>
  );
};

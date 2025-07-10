"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (formData: LoginFormData) => Promise<void>;
  isLoading: boolean;
  error: string;
  successMessage: string;
  onErrorClear?: () => void;
}

export const LoginForm = ({
  onSubmit,
  isLoading,
  error,
  successMessage,
  onErrorClear,
}: LoginFormProps) => {
  const [form, setForm] = useState<LoginFormData>({
    email: "maria@mail.com",
    password: "12345",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error && onErrorClear) {
      onErrorClear();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Notice */}
      <div className="alert alert-info">
        <span>
          Demo account: <br /> email: maria@mail.com / password: 12345
        </span>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Email Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Email</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="input input-bordered w-full pl-10"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Password</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="input input-bordered w-full pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-base-content/50" />
            ) : (
              <Eye className="h-5 w-5 text-base-content/50" />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="label cursor-pointer">
          <input type="checkbox" className="checkbox checkbox-sm" />
          <span className="label-text ml-2">Remember me</span>
        </label>
        <Link href="/login" className="link link-primary text-sm">
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full"
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

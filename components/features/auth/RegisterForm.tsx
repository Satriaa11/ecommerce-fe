"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import Link from "next/link";

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (formData: Omit<RegisterForm, "confirmPassword">) => Promise<void>;
  isLoading: boolean;
  error: string;
}

export const RegisterForm = ({
  onSubmit,
  isLoading,
  error,
}: RegisterFormProps) => {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formError, setFormError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formError) setFormError("");
  };

  const validateForm = () => {
    if (form.password !== form.confirmPassword) {
      setFormError("Password and confirm password do not match");
      return false;
    }
    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return false;
    }
    if (!acceptTerms) {
      setFormError("You must agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await onSubmit({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
  };

  const displayError = error || formError;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {displayError && (
        <div className="alert alert-error">
          <span>{displayError}</span>
        </div>
      )}

      {/* Name Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Full Name</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="input input-bordered w-full pl-10"
            required
          />
        </div>
      </div>

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

      {/* Phone Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Phone Number</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
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
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-base-content/50" />
            ) : (
              <Eye className="h-5 w-5 text-base-content/50" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Confirm Password</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            className="input input-bordered w-full pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-base-content/50" />
            ) : (
              <Eye className="h-5 w-5 text-base-content/50" />
            )}
          </button>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="form-control">
        <label className="label cursor-pointer justify-start">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="label-text ml-3">
            I agree to the{" "}
            <Link href="/terms" className="link link-primary">
              terms and conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="link link-primary">
              privacy policy
            </Link>
          </span>
        </label>
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
            Signing up...
          </>
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
};

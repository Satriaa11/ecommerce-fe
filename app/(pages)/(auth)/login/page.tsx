"use client";

import { BackButton } from "@/components/shared/BackButton";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthHeader } from "@/components/features/auth/AuthHeader";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { useAppStore } from "@/stores/useAppStore";

interface LoginFormData {
  email: string;
  password: string;
}

// Component that uses useSearchParams
function LoginPageContent() {
  const [successMessage, setSuccessMessage] = useState("");
  const { login, isLoading, error, clearError } = useAppStore();

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for success message from registration
    const message = searchParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const handleLogin = async (formData: LoginFormData) => {
    try {
      await login(formData);
      // Redirect to home page after successful login
      router.push("/");
    } catch (error) {
      // Error is already handled in the store
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="max-w-md mx-auto mb-6">
          <BackButton text="Back to Home" />
        </div>

        <div className="max-w-md mx-auto">
          <AuthHeader
            title="Login to Your Account"
            subtitle="Don't have an account yet?"
            linkText="Register here"
            linkHref="/register"
          />

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <LoginForm
                onSubmit={handleLogin}
                isLoading={isLoading}
                error={error || ""}
                successMessage={successMessage}
                onErrorClear={clearError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function LoginPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full space-y-8">
        <div className="max-w-md mx-auto mb-6">
          <BackButton
            text="Back to Home"
            onClick={() => window.history.back()}
          />
        </div>

        <div className="max-w-md mx-auto">
          <AuthHeader
            title="Login to Your Account"
            subtitle="Don't have an account yet?"
            linkText="Register here"
            linkHref="/register"
          />

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-center py-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <LoginPageContent />
    </Suspense>
  );
}

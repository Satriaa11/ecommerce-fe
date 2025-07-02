"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { SocialAuth } from "@/components/features/auth/SocialAuth";
import { AuthHeader } from "@/components/features/auth/AuthHeader";
import { BackButton } from "@/components/shared/BackButton";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage or cookie
        localStorage.setItem("token", data.token);

        // Redirect to dashboard or home
        router.push("/dashboard");
      } else {
        setError(data.message || "Login gagal");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="max-w-md mx-auto mb-6">
          <BackButton />
        </div>

        <div className="max-w-md mx-auto">
          <AuthHeader
            title="Masuk ke Akun Anda"
            subtitle="Belum punya akun?"
            linkText="Daftar di sini"
            linkHref="/register"
          />

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <LoginForm
                onSubmit={handleLogin}
                isLoading={isLoading}
                error={error}
                successMessage={successMessage}
                onErrorClear={() => setError("")}
              />

              {/* Social Login */}
              <div className="divider">atau</div>
              <SocialAuth type="login" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

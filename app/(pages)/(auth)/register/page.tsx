"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { SocialAuth } from "@/components/features/auth/SocialAuth";
import { AuthHeader } from "@/components/features/auth/AuthHeader";

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (formData: RegisterData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login?message=Registrasi berhasil! Silakan login.");
      } else {
        setError(data.message || "Registrasi gagal");
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
        {/* Back to Home Button */}
        <div className="flex justify-start">
          <button
            onClick={() => router.push("/")}
            className="btn btn-ghost btn-sm gap-2"
            aria-label="Kembali ke beranda"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </button>
        </div>

        <AuthHeader
          title="Buat Akun Baru"
          subtitle="Sudah punya akun?"
          linkText="Masuk di sini"
          linkHref="/login"
        />

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading}
              error={error}
            />

            <div className="divider">atau</div>

            <SocialAuth type="register" />
          </div>
        </div>
      </div>
    </div>
  );
}

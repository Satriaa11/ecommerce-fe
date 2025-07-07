"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { SocialAuth } from "@/components/features/auth/SocialAuth";
import { AuthHeader } from "@/components/features/auth/AuthHeader";
import { createUser } from "@/utils/api";

interface RegisterData {
  name: string;
  email: string;
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
      // Prepare data untuk API escuelajs
      const createUserData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: "https://picsum.photos/800", // Default avatar
      };

      await createUser(createUserData);

      // Redirect ke login dengan success message
      router.push(
        "/login?message=Registrasi berhasil! Silakan login dengan akun baru Anda.",
      );
    } catch (error) {
      console.error("Registration error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat registrasi. Silakan coba lagi.";

      setError(errorMessage);
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

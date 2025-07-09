import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/stores/useAppStore";
import {
  updatePasswordSchema,
  UpdatePasswordFormData,
} from "@/schema/profileSchema";
import {
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Lock,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const AccountSettings = () => {
  const { user, updatePassword } = useAppStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Clear notification setelah 5 detik
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const onSubmitPassword = async (data: UpdatePasswordFormData) => {
    try {
      // Fix: Pass correct data structure
      await updatePassword({
        currentPassword: data.currentPassword,
        password: data.newPassword,
      });

      setNotification({
        type: "success",
        message: "Password berhasil diperbarui",
      });

      // Reset form setelah berhasil
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      setNotification({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui password. Silakan coba lagi.",
      });
    }
  };

  // Jika user belum login, tampilkan pesan
  if (!user) {
    return (
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-warning mb-4" />
          <h3 className="text-lg font-semibold mb-2">Akses Terbatas</h3>
          <p className="text-base-content/70">
            Silakan login terlebih dahulu untuk mengakses pengaturan akun.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`alert ${
            notification.type === "success" ? "alert-success" : "alert-error"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Security Settings - Password Update */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">
            <Shield className="w-5 h-5" />
            Keamanan Akun
          </h2>

          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
            {/* Password Lama */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password Lama</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className={`input input-bordered w-full pr-10 ${
                    errors.currentPassword ? "input-error" : ""
                  }`}
                  placeholder="Masukkan password lama"
                  {...register("currentPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-primary transition-colors"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={
                    showCurrentPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5 text-base-content/50" />
                  ) : (
                    <Eye className="w-5 h-5 text-base-content/50" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.currentPassword.message}
                  </span>
                </label>
              )}
            </div>

            {/* Password Baru */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password Baru</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pr-10 ${
                    errors.newPassword ? "input-error" : ""
                  }`}
                  placeholder="Masukkan password baru"
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-base-content/50" />
                  ) : (
                    <Eye className="w-5 h-5 text-base-content/50" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.newPassword.message}
                  </span>
                </label>
              )}
            </div>

            {/* Konfirmasi Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Konfirmasi Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`input input-bordered w-full pr-10 ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  placeholder="Konfirmasi password baru"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-primary transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Sembunyikan konfirmasi password"
                      : "Tampilkan konfirmasi password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-base-content/50" />
                  ) : (
                    <Eye className="w-5 h-5 text-base-content/50" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.confirmPassword.message}
                  </span>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Memperbarui Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Perbarui Password
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Password Requirements Info */}
          <div className="mt-6 p-4 bg-base-200 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Persyaratan Password:</h4>
            <ul className="text-xs text-base-content/70 space-y-1">
              <li>• Minimal 8 karakter</li>
              <li>• Mengandung huruf besar (A-Z)</li>
              <li>• Mengandung huruf kecil (a-z)</li>
              <li>• Mengandung angka (0-9)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Pengaturan Tema</h2>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Mode Gelap</h3>
              <p className="text-sm text-base-content/70">
                Ubah tampilan aplikasi ke mode gelap atau terang
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Informasi Akun</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-base-200">
              <span className="text-sm font-medium">Nama:</span>
              <span className="text-sm">{user.name}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-base-200">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm">{user.email}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">ID Pengguna:</span>
              <span className="text-sm text-base-content/70">#{user.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit2, Save, X, AlertCircle, CheckCircle } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

// Schema validasi Zod
const profileSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileInfo = () => {
  const { user, updateProfile } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const watchedEmail = watch("email");

  // Reset form ketika user data berubah
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  // Clear notification setelah 5 detik
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fungsi untuk cek ketersediaan email
  const checkEmailAvailability = async (email: string) => {
    if (!email || email === user?.email) {
      setEmailAvailable(null);
      return;
    }

    setIsCheckingEmail(true);
    try {
      const response = await fetch(
        "https://api.escuelajs.co/api/v1/users/is-available",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setEmailAvailable(data.isAvailable || true); // Asumsi API mengembalikan isAvailable
        if (!data.isAvailable) {
          setError("email", {
            type: "manual",
            message: "Email sudah digunakan",
          });
        } else {
          clearErrors("email");
        }
      }
    } catch (error) {
      console.error("Error checking email availability:", error);
      setEmailAvailable(null);
      // Jika API tidak tersedia, anggap email tersedia
      setEmailAvailable(true);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Handle email blur
  const handleEmailBlur = () => {
    if (watchedEmail && watchedEmail !== user?.email) {
      checkEmailAvailability(watchedEmail);
    }
  };

  // Handle form submit
  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Hanya kirim data yang berubah
      const updatedData: Partial<ProfileFormData> = {};

      if (data.name !== user?.name) {
        updatedData.name = data.name;
      }

      if (data.email !== user?.email) {
        updatedData.email = data.email;
      }

      // Jika tidak ada perubahan
      if (Object.keys(updatedData).length === 0) {
        setNotification({
          type: "error",
          message: "Tidak ada perubahan yang disimpan",
        });
        setIsEditing(false);
        return;
      }

      // Panggil updateProfile dari store
      await updateProfile(updatedData);

      setNotification({
        type: "success",
        message: "Profil berhasil diperbarui",
      });
      setIsEditing(false);
      setEmailAvailable(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        type: "error",
        message: "Gagal memperbarui profil. Silakan coba lagi.",
      });
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
    setEmailAvailable(null);
    clearErrors();
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        {/* Notification */}
        {notification && (
          <div
            className={`alert ${
              notification.type === "success" ? "alert-success" : "alert-error"
            } mb-4`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="card-title">Informasi Personal</h2>
          {!isEditing ? (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="submit"
                form="profile-form"
                className="btn btn-primary btn-sm"
                disabled={
                  isSubmitting || isCheckingEmail || emailAvailable === false
                }
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan
                  </>
                )}
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
                Batal
              </button>
            </div>
          )}
        </div>

        <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6">
            {/* Name */}
            <div className="form-control">
              <div className="flex items-center gap-4">
                <label className="label w-32 flex-shrink-0">
                  <span className="label-text">Nama Lengkap</span>
                </label>
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      className={`input input-bordered w-full ${
                        errors.name ? "input-error" : ""
                      }`}
                      placeholder="Masukkan nama lengkap"
                      {...register("name")}
                    />
                    {errors.name && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.name.message}
                        </span>
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-base-200 rounded-lg flex-1">
                    {user?.name || "-"}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <div className="flex items-center gap-4">
                <label className="label w-32 flex-shrink-0">
                  <span className="label-text">Email</span>
                </label>
                {isEditing ? (
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="email"
                        className={`input input-bordered w-full pr-10 ${
                          errors.email ? "input-error" : ""
                        } ${emailAvailable === true ? "input-success" : ""}`}
                        placeholder="Masukkan alamat email"
                        {...register("email")}
                        onBlur={handleEmailBlur}
                      />
                      {isCheckingEmail && (
                        <span className="loading loading-spinner loading-sm absolute right-3 top-1/2 transform -translate-y-1/2"></span>
                      )}
                      {!isCheckingEmail && emailAvailable === true && (
                        <CheckCircle className="w-5 h-5 text-success absolute right-3 top-1/2 transform -translate-y-1/2" />
                      )}
                      {!isCheckingEmail && emailAvailable === false && (
                        <AlertCircle className="w-5 h-5 text-error absolute right-3 top-1/2 transform -translate-y-1/2" />
                      )}
                    </div>
                    {errors.email && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.email.message}
                        </span>
                      </label>
                    )}
                    {!errors.email &&
                      emailAvailable === true &&
                      watchedEmail !== user?.email && (
                        <label className="label">
                          <span className="label-text-alt text-success">
                            Email tersedia
                          </span>
                        </label>
                      )}
                  </div>
                ) : (
                  <div className="p-3 bg-base-200 rounded-lg flex-1">
                    {user?.email || "-"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

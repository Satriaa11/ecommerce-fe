"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { User, Camera, CheckCircle, AlertCircle } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

export const ProfileHeader = () => {
  const { user, updateProfile, uploadFile } = useAppStore();
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format member since date
  const formatMemberSince = (date: string) => {
    if (!date) return "Recently joined";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
    }).format(new Date(date));
  };

  // Handle change photo button click
  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file change
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setNotification(null);

    try {
      // 1. Upload file to API using store method
      const newImageUrl = await uploadFile(file);

      // 2. Update profile with new avatar
      await updateProfile({
        avatar: newImageUrl,
      });

      // 3. Show success notification
      setNotification({
        type: "success",
        message: "Profile picture updated successfully",
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      setNotification({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update profile picture",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    width={200}
                    height={200}
                    alt={`${user.name} avatar`}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-base-300 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-base-content/50" />
                  </div>
                )}

                {/* Fallback icon if image error */}
                {user?.avatar && (
                  <div className="w-full h-full bg-base-300 rounded-full items-center justify-center hidden">
                    <User className="w-12 h-12 text-base-content/50" />
                  </div>
                )}
              </div>
            </div>

            {/* Upload overlay when loading */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <span className="loading loading-spinner loading-md text-white"></span>
              </div>
            )}
          </div>

          {/* User Info Section */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-base-content">
              {user?.name || "User Name"}
            </h1>
            <p className="text-base-content/70 mt-1">
              {user?.email || "email@example.com"}
            </p>
            <p className="text-sm text-base-content/50 mt-2">
              Member since {formatMemberSince("2024-01-01")}
            </p>

            {/* Change Photo Button */}
            <button
              className="btn btn-outline btn-sm mt-4"
              onClick={handleChangePhotoClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  Change Photo
                </>
              )}
            </button>

            {/* Hidden file input */}
            <input
              title="Upload Profile Photo"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Stats or additional info */}
        <div className="stats stats-horizontal shadow mt-6">
          <div className="stat">
            <div className="stat-title">Total Orders</div>
            <div className="stat-value text-primary">0</div>
          </div>
          <div className="stat">
            <div className="stat-title">Reward Points</div>
            <div className="stat-value text-secondary">0</div>
          </div>
          <div className="stat">
            <div className="stat-title">Status</div>
            <div className="stat-value text-accent text-sm">Member</div>
          </div>
        </div>
      </div>
    </div>
  );
};

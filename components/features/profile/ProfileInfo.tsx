"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit2, Save, X, AlertCircle, CheckCircle } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

// Zod validation schema
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
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

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Function to check email availability
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
        }
      );

      const data = await response.json();

      if (response.ok) {
        setEmailAvailable(data.isAvailable || true); // Assume API returns isAvailable
        if (!data.isAvailable) {
          setError("email", {
            type: "manual",
            message: "Email is already taken",
          });
        } else {
          clearErrors("email");
        }
      }
    } catch (error) {
      console.error("Error checking email availability:", error);
      setEmailAvailable(null);
      // If API is not available, assume email is available
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
      // Only send changed data
      const updatedData: Partial<ProfileFormData> = {};

      if (data.name !== user?.name) {
        updatedData.name = data.name;
      }

      if (data.email !== user?.email) {
        updatedData.email = data.email;
      }

      // If no changes
      if (Object.keys(updatedData).length === 0) {
        setNotification({
          type: "error",
          message: "No changes to save",
        });
        setIsEditing(false);
        return;
      }

      // Call updateProfile from store
      await updateProfile(updatedData);

      setNotification({
        type: "success",
        message: "Profile updated successfully",
      });
      setIsEditing(false);
      setEmailAvailable(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        type: "error",
        message: "Failed to update profile. Please try again.",
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
          <h2 className="card-title">Personal Information</h2>
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
                Cancel
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
                  <span className="label-text">Full Name</span>
                </label>
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      className={`input input-bordered w-full ${
                        errors.name ? "input-error" : ""
                      }`}
                      placeholder="Enter your full name"
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
                        placeholder="Enter your email address"
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
                            Email is available
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

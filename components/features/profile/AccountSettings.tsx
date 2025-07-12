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

  // Clear notification after 5 seconds
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
        message: "Password updated successfully",
      });

      // Reset form after success
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
            : "Failed to update password. Please try again.",
      });
    }
  };

  // If user is not logged in, show message
  if (!user) {
    return (
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-warning mb-4" />
          <h3 className="text-lg font-semibold mb-2">Limited Access</h3>
          <p className="text-base-content/70">
            Please log in first to access account settings.
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
            Account Security
          </h2>

          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
            {/* Current Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Current Password</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className={`input input-bordered w-full pr-10 ${
                    errors.currentPassword ? "input-error" : ""
                  }`}
                  placeholder="Enter current password"
                  {...register("currentPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-primary transition-colors"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={
                    showCurrentPassword ? "Hide password" : "Show password"
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

            {/* New Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pr-10 ${
                    errors.newPassword ? "input-error" : ""
                  }`}
                  placeholder="Enter new password"
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`input input-bordered w-full pr-10 ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  placeholder="Confirm new password"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-primary transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
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
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Password Requirements Info */}
          <div className="mt-6 p-4 bg-base-200 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Password Requirements:</h4>
            <ul className="text-xs text-base-content/70 space-y-1">
              <li>• Minimum 8 characters</li>
              <li>• Contains uppercase letters (A-Z)</li>
              <li>• Contains lowercase letters (a-z)</li>
              <li>• Contains numbers (0-9)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Theme Settings</h2>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-base-content/70">
                Switch between light and dark theme
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Account Information</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-base-200">
              <span className="text-sm font-medium">Name:</span>
              <span className="text-sm">{user.name}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-base-200">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm">{user.email}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">User ID:</span>
              <span className="text-sm text-base-content/70">#{user.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

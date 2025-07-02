"use client";

import { useState } from "react";
import {
  Shield,
  Bell,
  Eye,
  EyeOff,
  Trash2,
  LogOut,
  Palette,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const AccountSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showOnlineStatus: false,
    allowDataCollection: true,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Appearance Settings */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">
            <Palette className="w-5 h-5" />
            Appearance
          </h2>

          <div className="space-y-4">
            <div className="form-control">
              <div className="flex items-center justify-between">
                <div>
                  <span className="label-text font-medium">Theme</span>
                  <p className="text-sm text-base-content/70">
                    Choose between light and dark mode
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">
            <Shield className="w-5 h-5" />
            Security Settings
          </h2>

          <div className="space-y-4">
            <div className="form-control">
              <div className="flex items-center gap-4">
                <label className="label w-40 flex-shrink-0">
                  <span className="label-text">Current Password</span>
                </label>
                <div className="relative flex-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-control">
              <div className="flex items-center gap-4">
                <label className="label w-40 flex-shrink-0">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered flex-1"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div className="form-control">
              <div className="flex items-center gap-4">
                <label className="label w-40 flex-shrink-0">
                  <span className="label-text">Confirm New Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered flex-1"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="btn btn-primary">Update Password</button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </h2>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={value}
                    onChange={() =>
                      handleNotificationChange(
                        key as keyof typeof notifications,
                      )
                    }
                  />
                  <span className="label-text capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()} Notifications
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Privacy Settings</h2>

          <div className="space-y-4">
            {Object.entries(privacy).map(([key, value]) => (
              <div key={key} className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={value}
                    onChange={() =>
                      handlePrivacyChange(key as keyof typeof privacy)
                    }
                  />
                  <span className="label-text">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card bg-base-100 shadow-lg border-error">
        <div className="card-body">
          <h2 className="card-title text-error mb-4">Danger Zone</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
              <div>
                <h3 className="font-semibold">Log out from all devices</h3>
                <p className="text-sm text-base-content/70">
                  This will log you out from all devices and sessions.
                </p>
              </div>
              <button className="btn btn-outline btn-warning">
                <LogOut className="w-4 h-4" />
                Log Out All
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-error rounded-lg">
              <div>
                <h3 className="font-semibold text-error">Delete Account</h3>
                <p className="text-sm text-base-content/70">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <button className="btn btn-error">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

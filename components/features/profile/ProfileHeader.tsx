"use client";

import { User, Camera } from "lucide-react";

export const ProfileHeader = () => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="avatar">
            <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <div className="w-full h-full bg-base-200 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-base-content/50" />
              </div>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-base-content/70">john.doe@example.com</p>
            <p className="text-sm text-base-content/50 mt-1">
              Member since January 2024
            </p>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm">
              <Camera className="w-4 h-4" />
              Change Photo
            </button>
            <button className="btn btn-primary btn-sm">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

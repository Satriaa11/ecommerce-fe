"use client";

import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";

export const ProfileInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    dateOfBirth: "1990-01-01",
    gender: "male",
  });

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data
    setIsEditing(false);
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
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
              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save
              </button>
              <button className="btn btn-outline btn-sm" onClick={handleCancel}>
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="form-control">
              <div className="flex items-center gap-4">
                <label className="label w-32 flex-shrink-0">
                  <span className="label-text">First Name</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="Enter first name"
                    aria-label="First Name"
                  />
                ) : (
                  <div className="p-3 bg-base-200 rounded-lg flex-1">
                    {formData.firstName}
                  </div>
                )}
              </div>
            </div>

            <div className="form-control">
              <div className="flex items-center gap-4">
                <label className="label w-32 flex-shrink-0">
                  <span className="label-text">Last Name</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Enter last name"
                    aria-label="Last Name"
                  />
                ) : (
                  <div className="p-3 bg-base-200 rounded-lg flex-1">
                    {formData.lastName}
                  </div>
                )}
              </div>
            </div>

            <div className="form-control">
              <div className="flex items-center gap-4">
                <label className="label w-32 flex-shrink-0">
                  <span className="label-text">Email</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    className="input input-bordered flex-1"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter email address"
                    aria-label="Email"
                  />
                ) : (
                  <div className="p-3 bg-base-200 rounded-lg flex-1">
                    {formData.email}
                  </div>
                )}
              </div>
            </div>

            <div className="form-control">
              <div className="flex items-center gap-4">
                <label className="label w-32 flex-shrink-0">
                  <span className="label-text">Phone</span>
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="input input-bordered flex-1"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                    aria-label="Phone"
                  />
                ) : (
                  <div className="p-3 bg-base-200 rounded-lg flex-1">
                    {formData.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="form-control">
              <div className="flex items-center gap-4">
                <label className="label w-32 flex-shrink-0">
                  <span className="label-text">Date of Birth</span>
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    className="input input-bordered flex-1"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    aria-label="Date of Birth"
                  />
                ) : (
                  <div className="p-3 bg-base-200 rounded-lg flex-1">
                    {new Date(formData.dateOfBirth).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <div className="form-control">
              <div className="flex items-center gap-4">
                <label className="label w-32 flex-shrink-0">
                  <span className="label-text">Gender</span>
                </label>
                {isEditing ? (
                  <select
                    className="select select-bordered flex-1"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    aria-label="Gender"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div className="p-3 bg-base-200 rounded-lg flex-1 capitalize">
                    {formData.gender}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

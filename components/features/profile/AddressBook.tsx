"use client";

import { useState } from "react";
import { MapPin, Plus, Edit2, Trash2, Home, Building } from "lucide-react";

interface Address {
  id: string;
  type: "home" | "office";
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: "1",
    type: "home",
    name: "Home Address",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    isDefault: true,
  },
  {
    id: "2",
    type: "office",
    name: "Office Address",
    street: "456 Business Ave",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    country: "United States",
    isDefault: false,
  },
];

export const AddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [, setShowAddForm] = useState(false);

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex justify-between items-center mb-6">
          <h2 className="card-title">Address Book</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        </div>

        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border border-base-300 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {address.type === "home" ? (
                      <Home className="w-5 h-5 text-primary" />
                    ) : (
                      <Building className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{address.name}</h3>
                      {address.isDefault && (
                        <span className="badge badge-primary badge-sm">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-base-content/70">
                      {address.street}
                      <br />
                      {address.city}, {address.state} {address.zipCode}
                      <br />
                      {address.country}
                    </p>
                  </div>
                </div>

                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-sm"
                  >
                    ⋮
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg border border-base-300"
                  >
                    <li>
                      <button onClick={() => handleSetDefault(address.id)}>
                        <MapPin className="w-4 h-4" />
                        Set as Default
                      </button>
                    </li>
                    <li>
                      <button>
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        className="text-error"
                        onClick={() => handleDelete(address.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {addresses.length === 0 && (
          <div className="text-center py-8">
            <MapPin className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
            <p className="text-base-content/70">
              Add your first address to make checkout faster.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

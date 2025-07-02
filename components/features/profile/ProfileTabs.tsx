"use client";

import { User, Package, MapPin, Settings } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "profile", label: "Profile Info", icon: User },
  { id: "orders", label: "Order History", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
];

export const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-0">
        <ul className="menu menu-vertical w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <li key={tab.id}>
                <button
                  className={`flex items-center gap-3 w-full text-left ${
                    activeTab === tab.id ? "active" : ""
                  }`}
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

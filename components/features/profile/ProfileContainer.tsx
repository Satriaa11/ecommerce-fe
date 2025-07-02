"use client";

import { useState } from "react";
import MaxWidthWrapperNavbar from "@/components/MaxWidthWrapperNavbar";
import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";
import { ProfileInfo } from "./ProfileInfo";
import { OrderHistory } from "./OrderHistory";
import { AddressBook } from "./AddressBook";
import { AccountSettings } from "./AccountSettings";

export const ProfileContainer = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo />;
      case "orders":
        return <OrderHistory />;
      case "addresses":
        return <AddressBook />;
      case "settings":
        return <AccountSettings />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <MaxWidthWrapperNavbar className="py-8">
      <div className="space-y-6">
        <ProfileHeader />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="lg:col-span-3">{renderTabContent()}</div>
        </div>
      </div>
    </MaxWidthWrapperNavbar>
  );
};

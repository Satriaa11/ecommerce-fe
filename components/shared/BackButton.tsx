"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
  showHomeButton?: boolean;
}

export const BackButton = ({
  text = "Kembali",
  onClick,
  className = "btn btn-ghost btn-sm gap-2",
}: BackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  //   const handleHome = () => {
  //     router.push("/");
  //   };

  return (
    <div className="flex gap-2">
      <button onClick={handleBack} className={className}>
        <ArrowLeft className="h-4 w-4" />
        {text}
      </button>

      {/* {showHomeButton && (
        <button onClick={handleHome} className="btn btn-ghost btn-sm gap-2">
          <Home className="h-4 w-4" />
          Home
        </button>
      )} */}
    </div>
  );
};

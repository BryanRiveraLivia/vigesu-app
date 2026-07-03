"use client";
import { usePageTitle } from "@/presentation/hooks/usePageTitle";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { BackButtonProps } from "./BackButton.types";

const BackButton: FC<BackButtonProps> = ({
  title,
  disableArrow = false,
  link,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const pageTitle = usePageTitle();

  const segments = pathname.split("/").filter(Boolean);
  const dashboardIndex = segments.findIndex((s) => s === "dashboard");
  const parentPath: string | null =
    dashboardIndex === -1 || segments.length <= dashboardIndex + 1
      ? null
      : "/" + segments.slice(0, segments.length - 1).join("/");

  const handleBack = () => {
    if (link) {
      router.push(link);
    } else {
      if (parentPath) {
        router.push(parentPath);
      }
    }
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      <h1 className="font-bold text-xl md:text-2xl lg:text-3xl gap-2 flex flex-row items-center justify-start ">
        {!disableArrow && (
          <button onClick={handleBack} className="btn btn-sm">
            ←
          </button>
        )}
        {title ||
          (pageTitle ? (
            pageTitle
          ) : (
            <div className="skeleton h-6 w-48 rounded"></div>
          ))}
      </h1>
    </div>
  );
};

export default BackButton;

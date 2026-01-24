"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { capitalizeWords, segments } from "@/infrastructure/lib/utils";

const Breadcrumb: React.FC = () => {
  const pathname = usePathname();

  const parts = segments(pathname);

  return (
    <div className="breadcrumbs  flex items-center justify-start">
      <div className="breadcrumbs">
        <ul>
          {parts.map((segment: string, index: number) => {
            const label = capitalizeWords(segment);
            const path = "/" + parts.slice(0, index + 1).join("/");

            const isFirst = index === 0;
            const isLast = index === parts.length - 1;

            const className = !isFirst ? "text-black" : "text-gray-400";

            return (
              <li key={index} className={className}>
                {<span>{label}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumb;

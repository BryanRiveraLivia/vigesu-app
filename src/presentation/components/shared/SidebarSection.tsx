"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { useSidebarStore } from "@/presentation/stores/useSidebarStore";
import { SidebarSectionWithActive } from "./SidebarSection.types";

const SidebarSection: React.FC<SidebarSectionWithActive> = ({
  title,
  links,
  activeHref,
}) => {
  const closeSidebar = useSidebarStore((state) => state.toggleSidebar);

  return (
    <ul className="mb-5">
      <li>
        <p className="uppercase text-sm text-gray-400 tracking-[.5px] font-light mb-2">
          {title}
        </p>
        <ul className="flex flex-col gap-1">
          {links.map((link, index) => {
            const isActive = link.href === activeHref;

            return (
              <li key={index}>
                <Link
                  href={link.href}
                  onClick={closeSidebar}
                  className={clsx(
                    "text-white font-light w-full flex items-center justify-start min-h-[40px] px-4 rounded-sm gap-3",
                    "hover:bg-[#ffffff1f] hover:text-white hover:shadow-xl hover:pl-5 transition-all",
                    {
                      "bg-[#ffffff1f] text-white": isActive,
                    },
                  )}
                >
                  {link.icon && <span className="text-xl">{link.icon}</span>}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </li>
    </ul>
  );
};

export default SidebarSection;

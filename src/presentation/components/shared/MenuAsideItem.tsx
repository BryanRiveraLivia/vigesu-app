"use client";

import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import { PiCaretDownBold } from "react-icons/pi";
import { MenuAsideItemProps } from "@/core/types/TGeneral";

const MenuAsideItem: FC<MenuAsideItemProps> = ({
  sectionTitle,
  buttonLabel,
  icon,
  openMenu,
  subItems,
  className,
}) => {
  const [open, setOpen] = useState<boolean>(openMenu);

  useEffect(() => {
    setOpen(openMenu);
  }, [openMenu]);

  return (
    <ul className={`px-4 w-full  ${className}`}>
      <li className="text-[#6a7187] uppercase tracking-wider text-[13px] w-full">
        {sectionTitle && sectionTitle}
        <ul className="pl-2 capitalize pt-3 w-full">
          <li>
            <button
              onClick={() => setOpen(!open)}
              className="flex justify-between transition-all items-center flex-row gap-4 text-white hover:text-white font-light w-full min-h-[45px] cursor-pointer"
            >
              <div className="flex flex-row items-center gap-4">
                <span className="text-white text-2xl">{icon}</span>
                <span className="font-normal">{buttonLabel}</span>
              </div>
              {subItems && (
                <PiCaretDownBold
                  className={`font-bold text-lg transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {subItems && open && (
              <ul className="pl-10">
                {subItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="flex justify-between transition-all items-center flex-row gap-4 text-[#79829c] hover:text-white font-light w-full min-h-[35px]"
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default MenuAsideItem;

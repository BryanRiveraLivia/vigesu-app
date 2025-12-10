"use client";

import {
  SlBookOpen,
  SlDirections,
  SlLayers,
  SlLogin,
  SlNote,
  SlOptions,
  SlPeople,
  SlSettings,
  SlUser,
} from "react-icons/sl";
import { TbPointFilled } from "react-icons/tb";
import SidebarSection from "./SidebarSection";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { useSidebarStore } from "../../stores/useSidebarStore";
import { IoCloseOutline } from "react-icons/io5";
import { generalReactClass } from "@/shared/types/TGeneral";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineServer } from "react-icons/hi2";
import { getTotalWorkOrders } from "@/features/orders/api/workOrdersApi";
import { useAuthUser } from "@/shared/stores/useAuthUser";
import { getInspections } from "@/features/orders/inspections/api/inspectionApi";
import Loading from "./Loading";
import { getInitials } from "@/shared/utils/utils";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { TbDeviceTabletCheck } from "react-icons/tb";
import { useTranslations } from "next-intl";

const MenuAside: FC<generalReactClass> = ({ className }) => {
  const t = useTranslations("aside");
  const tLogout = useTranslations("logout");
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { userName, employeeName, rol } = useAuthUser();
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);
  const pathname = usePathname();
  const cleanPath = pathname?.replace(/^\/(es|en|fr)(\/|$)/, "/");
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [totalInspections, setTotalInspections] = useState<number | null>(null);

  //  Todas tus rutas reales definidas abajo
  const ordersLinks =
    rol === 1
      ? [
          {
            label: t("module1.menu1"),
            href: "/dashboard/documents/work-orders",
            icon: <SlBookOpen />,
          },
          {
            label: t("module1.menu2"),
            href: "/dashboard/documents/inspections",
            icon: <SlNote />,
          },
        ]
      : [
          {
            label: t("module1.menu2"),
            href: "#",
            icon: <SlNote />,
          },
        ];

  const inspectionsLinks = [
    {
      label: t("module2.menu1"),
      href: "/dashboard/inspections/inspection-configuration",
      icon: <SlSettings />,
    },
    {
      label: t("module2.menu2"),
      href: "/dashboard/inspections/groups",
      icon: <SlLayers />,
    },
    {
      label: t("module2.menu3"),
      href: "/dashboard/inspections/users",
      icon: <SlUser />,
    },
  ];

  const configurationLinks = [
    {
      label: t("module3.menu1"),
      href: "#",
      icon: <SlSettings />,
    },
    {
      label: t("module3.menu2"),
      href: "/dashboard/configurations/ic-theme",
      icon: <SlDirections />,
    },
  ];

  const allLinks = [...ordersLinks, ...inspectionsLinks, ...configurationLinks];

  const activeHref =
    allLinks
      .filter(
        (link) =>
          cleanPath === link.href || cleanPath?.startsWith(link.href + "/")
      )
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? undefined;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    const fetchTotal = async () => {
      const count = await getTotalWorkOrders();
      setTotalOrders(count ?? 0);
    };
    const fetchTotalInspections = async () => {
      const response = await getInspections({ PageNumber: 1, PageSize: 10 });
      setTotalInspections(response.totalCount ?? 0);
    };

    setTimeout(() => {
      fetchTotal();
      fetchTotalInspections();
    }, 1500);
  }, []);

  return (
    <aside className={`flex flex-row h-full ${className}`}>
      <div className="flex-1 h-full flex flex-col">
        {/* HEADER */}
        <div
          className="title w-full h-[60px] flex items-center justify-between px-4 gap-3"
          style={{ borderBottom: "1px solid #ffffff17" }}
        >
          <div className="flex flex-row items-center gap-2">
            <div className="avatar avatar-online avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-10 rounded-full">
                <span className="text-xl">
                  {employeeName && getInitials(employeeName)}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-[.5px]">
              <h1 className="text-white text-sm font-light">{employeeName}</h1>
              <span className="text-gray-500 text-xs">{userName}</span>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <button
              role="button"
              onClick={() => {
                closeSidebar();
              }}
              className="btn btn-square btn-neutral bg-[#ffffff1f] shadow-none border-none flex "
            >
              {!isSidebarOpen ? (
                <IoCloseOutline className="text-2xl" />
              ) : (
                <TbDeviceTabletCheck className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="dashboard-info p-5 flex flex-col gap-2 min-h-[78px]">
            <div className="flex items-center justify-start gap-2">
              <p className="text-white font-medium tracking-[1px] text-xl">
                {t("module0.title")}
              </p>
              <p className="bg-red-400 text-white text-xs px-2 w-[23px] h-[14px] flex items-center justify-center rounded-full shadow-2xl">
                <span className="relative top-[1px]">12</span>
              </p>
            </div>
            <div className="flex flex-row gap-2 text-white text-sm font-light tracking-[.5px] items-center justify-start">
              {totalInspections && totalInspections > 0 ? (
                <div>
                  {totalInspections}{" "}
                  <span className="text-emerald-500 ">
                    {t("module0.inspections")}
                  </span>
                </div>
              ) : (
                <div className="flex flex-row items-center justify-center gap-2">
                  {totalInspections === null && (
                    <Loading
                      height="h-auto"
                      enableLabel={false}
                      size="loading-sm"
                    />
                  )}
                  {totalInspections}{" "}
                  <span className="text-emerald-500 ">
                    {t("module0.inspections")}
                  </span>
                </div>
              )}
              <TbPointFilled className="text-xs text-shadow-emerald-800" />

              {totalOrders && totalOrders > 0 ? (
                <div>
                  {totalOrders}{" "}
                  <span className="text-emerald-500 ">
                    {t("module0.orders")}
                  </span>
                </div>
              ) : (
                <div className="flex flex-row items-center justify-center gap-2">
                  {totalOrders === null && (
                    <Loading
                      height="h-auto"
                      enableLabel={false}
                      size="loading-sm"
                    />
                  )}
                  {totalOrders}{" "}
                  <span className="text-emerald-500 ">
                    {t("module0.orders")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <nav className="p-5 flex flex-1 flex-col">
            <SidebarSection
              title={t("menus.name1")}
              links={ordersLinks}
              activeHref={activeHref}
            />
            {
              <>
                {rol === 1 && (
                  <SidebarSection
                    title={t("menus.name2")}
                    links={inspectionsLinks}
                    activeHref={activeHref}
                  />
                )}
                <SidebarSection
                  title={t("menus.name3")}
                  links={configurationLinks}
                  activeHref={activeHref}
                />
              </>
            }
          </nav>
        </div>

        {/* FOOTER */}
        <div
          className="sign-out min-h-[50px] px-4 flex items-row items-center justify-between"
          style={{ borderTop: "1px solid #ffffff17" }}
        >
          <div className="flex items-center justify-center">
            <div
              className="flex flex-row items-center justify-center cursor-pointer"
              onClick={handleLogout}
            >
              <button className="btn btn-square btn-neutral bg-transparent shadow-none border-none">
                <SlLogin className="text-2xl" />
              </button>
              <span className="text-white">{tLogout("logout")}</span>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-400">Version 0.0.1</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default MenuAside;

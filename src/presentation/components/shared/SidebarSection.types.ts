import { ReactNode } from "react";
import { SidebarSectionProps as BaseProps } from "@/core/types/TGeneral";

export interface SidebarSectionWithActive extends BaseProps {
  activeHref: string | undefined;
}

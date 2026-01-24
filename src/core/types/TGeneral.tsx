import { ReactNode } from "react";

export interface generalReactChildren {
  children: React.ReactNode;
}

export interface generalReactClass {
  className?: string;
}

export interface SubMenuItem {
  label: string;
  href: string;
}

export interface MenuAsideItemProps {
  sectionTitle?: string;
  buttonLabel: string;
  icon: ReactNode;
  openMenu: boolean;
  subItems?: SubMenuItem[];
  className?: string;
}

export interface SidebarLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface SidebarSectionProps {
  title: string;
  links: {
    label: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export interface SidebarState {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

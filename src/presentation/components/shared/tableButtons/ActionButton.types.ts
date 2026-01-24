import { ReactNode } from "react";

export interface ActionButtonProps {
  icon?: ReactNode;
  label?: string;
  onClick?: () => void;
  className?: string;
}

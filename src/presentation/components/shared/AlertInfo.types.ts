import { ReactNode } from "react";

export interface AlertInfoProps {
  children: ReactNode;
  variant?: "info" | "success" | "warning" | "error" | "neutral";
  className?: string;
}

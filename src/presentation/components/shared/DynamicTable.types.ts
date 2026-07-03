import { ReactNode } from "react";

export interface DynamicTableProps {
  children: ReactNode;
  className?: string;
  isEditable?: boolean;
}

export interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export interface TableCellProps {
  children?: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  isHeader?: boolean;
  isEditable?: boolean;
}

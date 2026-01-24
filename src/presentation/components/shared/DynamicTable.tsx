import React from "react";
import clsx from "clsx";
import {
  DynamicTableProps,
  TableHeadProps,
  TableRowProps,
  TableCellProps,
} from "./DynamicTable.types";

export const DynamicTable: React.FC<DynamicTableProps> = ({
  children,
  className,
  isEditable = false,
}) => {
  return (
    <table
      contentEditable={isEditable}
      suppressContentEditableWarning
      className={clsx(
        className,
        "w-full border-collapse border text-truncate ",
      )}
    >
      {children}
    </table>
  );
};

export const TableHead: React.FC<TableHeadProps> = ({
  children,
  className,
}) => {
  return <thead className={clsx("bg-black/5", className)}>{children}</thead>;
};

export const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={clsx("", className)}>{children}</tr>;
};

export const TableCell: React.FC<TableCellProps> = ({
  children,
  align = "left",
  className,
  isHeader = false,
  isEditable = false,
}) => {
  const Tag = isHeader ? "th" : "td";
  return (
    <Tag
      className={clsx(
        `p-2 !text-[11px] border text-${align}   `,
        isHeader && ` lg:truncate overflow-hidden`,
        className,
      )}
    >
      <p
        contentEditable={isEditable}
        suppressContentEditableWarning
        className={clsx(
          isHeader ? "!text-[11px]" : "!text-[11px]",
          " lg:truncate lg:whitespace-nowrap overflow-hidden block",
        )}
      >
        {children}
      </p>
    </Tag>
  );
};

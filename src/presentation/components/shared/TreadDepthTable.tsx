import React from "react";

interface TreadDepthTableProps {
  showAxleColumn?: boolean;
  nameTable?: string;
  columnCount?: number; // cantidad de columnas dinámicas
  columnLabels?: string[]; // opcional si quieres custom headers
  children: React.ReactNode;
  isEditable?: boolean;
}

const TreadDepthTable: React.FC<TreadDepthTableProps> = ({
  showAxleColumn = true,
  columnCount = 4,
  columnLabels = [],
  children,
  nameTable,
  isEditable = false,
}) => {
  const defaultLabels = [
    "Left Outer",
    "Left Inner",
    "Right Inner",
    "Right Outer",
  ];
  const headers = columnLabels.length
    ? columnLabels
    : defaultLabels.slice(0, columnCount);

  return (
    <div className="overflow-x-auto   w-full">
      <table className="table-auto border-collapse w-full">
        <thead>
          {nameTable && (
            <tr>
              {showAxleColumn && <th></th>}
              <th
                colSpan={columnCount}
                className="border p-2 bg-gray-200 uppercase !text-[11px] h-[47px]"
              >
                <span
                  className="truncate"
                  dangerouslySetInnerHTML={{ __html: nameTable || "" }}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                />
              </th>
            </tr>
          )}
          <tr>
            {showAxleColumn && <th className="border p-2 bg-gray-200 "></th>}
            {headers.map((label, index) => (
              <th
                key={index}
                className="border p-2 bg-gray-200 text-center !text-[11px] h-[47px]"
              >
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                >
                  {label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default TreadDepthTable;

import React from "react";

export interface TreadDepthTableProps {
  showAxleColumn?: boolean;
  nameTable?: string;
  columnCount?: number; // cantidad de columnas dinámicas
  columnLabels?: string[]; // opcional si quieres custom headers
  children: React.ReactNode;
  isEditable?: boolean;
}

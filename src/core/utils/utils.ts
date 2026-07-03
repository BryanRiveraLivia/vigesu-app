import { InspectionStatus } from "@/features/inspections/inspection-configuration/models/typeInspection";
import { WorkOrderStatus } from "@/features/inspections/models/inspections.types";
import { v4 as uuidv4 } from "uuid";

export const toISOStringWithTime = (date: string, time: string): string => {
  if (!date) return "";
  const isoDate = date + "T" + (time || "00:00") + ":00.000Z";
  return isoDate;
};

export const toISOStringDateOnly = (date: string): string => {
  if (!date) return "";
  return date + "T00:00:00.000Z";
};

export const toISOStringWithTimeSmart = (
  date: string,
  timeStart?: string,
  timeFinish?: string
): { start: string; finish: string } => {
  const baseDate = new Date(date + "T00:00:00.000Z");

  const safeTimeStart = timeStart?.trim() || "00:00";
  const safeTimeFinish = timeFinish?.trim() || "00:00";

  const [startHours, startMinutes] = safeTimeStart.split(":").map(Number);
  const [finishHours, finishMinutes] = safeTimeFinish.split(":").map(Number);

  const startDate = new Date(baseDate);
  startDate.setUTCHours(startHours, startMinutes, 0, 0);

  const finishDate = new Date(baseDate);
  finishDate.setUTCHours(finishHours, finishMinutes, 0, 0);

  if (finishDate <= startDate) {
    finishDate.setUTCDate(finishDate.getUTCDate() + 1);
  }

  return {
    start: startDate.toISOString(),
    finish: finishDate.toISOString(),
  };
};

export const sanitizeElementForPDF = (element: HTMLElement) => {
  const clone = element.cloneNode(true) as HTMLElement;

  const walk = (el: HTMLElement) => {
    const computedStyle = window.getComputedStyle(el);

    const color = computedStyle.color;
    const bg = computedStyle.backgroundColor;

    // Forzar color seguro si es oklch, hsl, var(), etc.
    if (
      color.includes("oklch") ||
      color.includes("var") ||
      color.includes("hsl")
    ) {
      el.style.color = "#000";
    }

    if (bg.includes("oklch") || bg.includes("var") || bg.includes("hsl")) {
      el.style.backgroundColor = "#fff";
    }

    // Recursivamente aplicar a hijos
    Array.from(el.children).forEach((child) => {
      if (child instanceof HTMLElement) walk(child);
    });
  };

  walk(clone);
  return clone;
};

export const formatDate = (input: string): string => {
  const date = new Date(input);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getMonth() + 1)}/${pad(
    date.getDate()
  )}/${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`;
};

export function renameFileWithUniqueName(file: File): File {
  const extension = file.name.split(".").pop();
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
  const uniqueId = uuidv4();
  const newName = `${timestamp}-${uniqueId}.${extension}`;

  return new File([file], newName, { type: file.type });
}

export const getWorkOrderStatusLabel = (status: WorkOrderStatus): string => {
  switch (status) {
    case WorkOrderStatus.Create:
      return "Create";
    case WorkOrderStatus.Disabled:
      return "Disabled";
    case WorkOrderStatus.SyncQuickbook:
      return "Sync Quickbook";
    default:
      return "Unknown";
  }
};

export const getInspectionStatusLabel = (status: InspectionStatus): string => {
  switch (status) {
    case InspectionStatus.Active:
      return "Active";
    default:
      return "Desactive";
  }
};

export const getInspectionStatusGroupsLabel = (status: number): string => {
  switch (status) {
    case InspectionStatus.Active:
      return "Active";
    case InspectionStatus.Inactive:
      return "Inactive";
    default:
      return "Unknown";
  }
};

export const isColorLight = (hexColor: string): boolean => {
  const hex = hexColor.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Fórmula estándar para luminancia perceptual
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  return luminance > 186; // Mayor a 186 se considera claro
};

export const getInitials = (fullName: string): string => {
  const words = fullName.trim().split(/\s+/); // separa por espacios múltiples
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
};

export const getTodayParts = () => {
  const today = new Date();

  return {
    day: String(today.getDate()).padStart(2, "0"), // 01-31
    month: String(today.getMonth() + 1).padStart(2, "0"), // 01-12
    year: String(today.getFullYear()), // YYYY
  };
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .normalize("NFD") // elimina acentos/diacríticos
    .replace(/[\u0300-\u036f]/g, "") // remueve marcas de acento
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // elimina caracteres no válidos
    .replace(/\s+/g, "-") // reemplaza espacios por guiones
    .replace(/-+/g, "-"); // evita guiones repetidos
};

export const deslugify = (slug: string): string => {
  if (!slug) return "";

  return slug
    .replace(/-/g, " ") // remplaza guiones por espacios
    .trim() // quita espacios al inicio/fin
    .replace(/\s+/g, " ") // normaliza espacios dobles
    .replace(/^./, (c) => c.toUpperCase()); // capitaliza la primera letra
};

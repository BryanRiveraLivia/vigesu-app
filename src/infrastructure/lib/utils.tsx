export const stripLocale = (path: string) => {
  const parts = path.split("/").filter(Boolean);
  if (parts[0]?.length === 2) {
    parts.shift();
  }
  return "/" + parts.join("/");
};

export const stripLocalePage = (path: string) => {
  const parts = path.split("/").filter(Boolean);
  if (parts[0]?.length === 2) {
    parts.shift();
  }
  return "page-" + parts.join("/");
};

export const capitalizeWords = (str: string) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export const segments = (str: string) =>
  str.split("/").filter((seg) => seg && !["es", "en"].includes(seg));

export const getLastPathSegmentFormatted = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean); // ["es", "dashboard", "work-orders"]
  const lastSegment = segments[segments.length - 1]; // "work-orders"

  if (!lastSegment) return "";

  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getFileName = (url: string): string => {
  const parts = url.split("/");
  return parts[parts.length - 1] || url;
};

export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin") ?? req.headers.get("referer") ?? "";
  const allowed = process.env.NEXT_PUBLIC_APP_URL ?? "";
  return allowed.length > 0 && origin.startsWith(allowed);
}

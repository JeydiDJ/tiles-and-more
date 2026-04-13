const FALLBACK_ADMIN_SEGMENT = "studio-entry";

function normalizeSegment(value?: string) {
  if (!value) {
    return FALLBACK_ADMIN_SEGMENT;
  }

  const trimmed = value.trim().replace(/^\/+|\/+$/g, "");

  return trimmed.length > 0 ? trimmed : FALLBACK_ADMIN_SEGMENT;
}

export function getAdminSegment() {
  return normalizeSegment(process.env.ADMIN_SECRET_PATH);
}

export function getAdminBasePath() {
  return `/${getAdminSegment()}`;
}

export function getAdminRoute(path = "") {
  const normalizedPath = path.replace(/^\/+/, "");
  const basePath = getAdminBasePath();

  return normalizedPath ? `${basePath}/${normalizedPath}` : basePath;
}

export function isDefaultAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}


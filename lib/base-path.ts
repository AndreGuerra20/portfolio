export function withBasePath(path: string) {
  const configured = process.env.NEXT_PUBLIC_BASE_PATH;

  if (configured) {
    return `${configured}${path}`;
  }

  if (typeof window !== "undefined" && window.location.pathname.startsWith("/portfolio/")) {
    return `/portfolio${path}`;
  }

  return path;
}
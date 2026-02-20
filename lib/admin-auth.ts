export function getExpectedAdminEmail() {
  return process.env.NEXT_PUBLIC_ADMIN_EMAIL;
}

export function getExpectedAdminPassword() {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
}

export const AUTH_KEY = "portfolio_admin_auth";
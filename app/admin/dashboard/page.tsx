export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/admin-auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function DashboardPage() {
  const session = getAdminSessionFromCookies();

  if (!session) {
    redirect("/admin");
  }

  return <AdminDashboard adminEmail={session.email} />;
}

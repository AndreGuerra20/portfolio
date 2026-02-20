export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getAdminSessionFromCookie } from "@/lib/admin-auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminDashboardPage() {

    const session = getAdminSessionFromCookie();

    // If there's no valid session, redirect to the login page. 
    if (!session) {
        redirect("/admin");
    }

    // If we have a valid session, render the dashboard with the admin's email.
    return <AdminDashboard adminEmail={session.email} />;
}
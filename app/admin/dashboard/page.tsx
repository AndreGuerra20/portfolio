"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AUTH_KEY, getExpectedAdminEmail } from "@/lib/admin-auth";

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isAuthed = window.localStorage.getItem(AUTH_KEY) === "1";

    if (!isAuthed) {
      router.replace("/admin");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return <main className="min-h-screen bg-slate-950 text-slate-300 p-6">A verificar autenticação...</main>;
  }

  const adminEmail = getExpectedAdminEmail();

  if (!adminEmail) {
    return <main className="min-h-screen bg-slate-950 text-slate-300 p-6">Variável de ambiente ADMIN_EMAIL não foi configurada.</main>;
  }

  return <AdminDashboard adminEmail={adminEmail} />;
}
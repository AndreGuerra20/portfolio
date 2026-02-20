import { Suspense } from "react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
                <p className="text-sm uppercase tracking-wider text-cyan-400">Admin Login</p>
                <h1 className="mt-2 text-3xl font-semibold">Entrar no painel</h1>
                <p className="mt-2 text-sm text-slate-400">Acesso restrito ao painel administrativo. Tresspassers will be shot.</p>

                <Suspense fallback={<p className="mt-6 text-sm text-slate-400">A carregar formulário...</p>}>
                    <AdminLoginForm />
                </Suspense>
            </div>
        </main>
    );
}
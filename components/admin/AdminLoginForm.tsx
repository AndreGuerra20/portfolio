"use client";

import { withBasePath } from "@/lib/base-path";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextPath = searchParams.get("next") ?? "/admin/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {

        // Prevent the default form submission behavior, which would cause a page reload.
        event.preventDefault();
        setLoading(true);
        setError(null);

        const x = withBasePath("/api/admin/auth/login");

        //console.log("Submitting login to:", x);

        const response = await fetch(x, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        setLoading(false);

        if (!response.ok) {
            const payload = await response.json().catch(() => ({ message: "Erro inesperado" }));
            setError(payload.message);
            return;
        }

        // If login is successful, navigate to the next path (defaulting to the dashboard).
        router.push(nextPath);
        router.refresh();
    }

    return (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-300">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none transition focus:border-cyan-400"
                />
            </div>
            <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-300">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none transition focus:border-cyan-400"
                />
            </div>

            {error ? <p className="text-sm text-rose-400">{error}</p> : null}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {loading ? "A autenticar..." : "Entrar"}
            </button>
        </form>
    );
}

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { error: signUpError } = await authClient.signUp.email({
                name,
                email,
                password,
            });
            if (signUpError) {
                setError(signUpError.message ?? "Sign up failed. Please try again.");
                setLoading(false);
                return;
            }
            router.push("/");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h2 className="text-xl font-semibold text-adm-text mb-6">Create Account</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="auth-name" className="block text-xs font-medium text-adm-muted mb-1.5 uppercase tracking-wider">
                        Full Name
                    </label>
                    <input
                        id="auth-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-3 rounded-xl bg-adm-bg/80 border border-adm-border text-adm-text placeholder-adm-muted/50 text-sm focus:outline-none focus:border-adm-accent focus:ring-1 focus:ring-adm-accent/40 transition-colors"
                    />
                </div>

                <div>
                    <label htmlFor="auth-email" className="block text-xs font-medium text-adm-muted mb-1.5 uppercase tracking-wider">
                        Email
                    </label>
                    <input
                        id="auth-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-adm-bg/80 border border-adm-border text-adm-text placeholder-adm-muted/50 text-sm focus:outline-none focus:border-adm-accent focus:ring-1 focus:ring-adm-accent/40 transition-colors"
                    />
                </div>

                <div>
                    <label htmlFor="auth-password" className="block text-xs font-medium text-adm-muted mb-1.5 uppercase tracking-wider">
                        Password
                    </label>
                    <input
                        id="auth-password"
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-adm-bg/80 border border-adm-border text-adm-text placeholder-adm-muted/50 text-sm focus:outline-none focus:border-adm-accent focus:ring-1 focus:ring-adm-accent/40 transition-colors"
                    />
                </div>

                {error && (
                    <div className="flex items-start gap-2 rounded-lg bg-adm-danger/10 border border-adm-danger/20 px-4 py-3 text-sm text-adm-danger">
                        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-adm-accent text-white font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-adm-accent/20"
                >
                    {loading && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    )}
                    Create Account
                </button>
            </form>

            <p className="text-center text-sm text-adm-muted mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-adm-accent hover:underline font-medium">
                    Login
                </Link>
            </p>
        </>
    );
}

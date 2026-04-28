"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import Link from "next/link";

export default function LoginForm() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		try {
			login(email, password);
			router.replace("/dashboard");
		} catch (err: any) {
			setError(err.message);
		}
	};

	return (
		<div className="w-full max-w-md px-6">
			{/* Card */}
			<div className="bg-white rounded-3xl shadow-[0_8px_48px_rgba(73,104,0,0.10)] px-10 py-12 flex flex-col gap-8">
				{/* Header */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-3 mb-1">
						<img
							src="/icons/icon-192x192.png"
							alt="Habit Tracker"
							className="w-9 h-9 rounded-xl"
						/>
						<span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#496800]">
							Habit Tracker
						</span>
					</div>
					<h1 className="text-[2rem] font-serif font-bold text-[#1a2400] leading-tight tracking-tight">
						Welcome back
					</h1>
					<p className="text-sm text-[#7a8a60]">
						Sign in to continue your streak.
					</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="login-email"
							className="text-xs font-semibold tracking-widest uppercase text-[#496800]"
						>
							Email
						</label>
						<input
							id="login-email"
							data-testid="auth-login-email"
							type="email"
							placeholder="you@example.com"
							className="w-full bg-[#F5F2EC] border border-transparent rounded-xl px-4 py-3 text-sm text-[#1a2400] placeholder:text-[#b5c49a] outline-none focus:border-[#496800] focus:bg-white transition-all duration-200"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="login-password"
							className="text-xs font-semibold tracking-widest uppercase text-[#496800]"
						>
							Password
						</label>
						<input
							id="login-password"
							data-testid="auth-login-password"
							type="password"
							placeholder="••••••••"
							className="w-full bg-[#F5F2EC] border border-transparent rounded-xl px-4 py-3 text-sm text-[#1a2400] placeholder:text-[#b5c49a] outline-none focus:border-[#496800] focus:bg-white transition-all duration-200"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3">
							{error}
						</div>
					)}

					<button
						type="submit"
						data-testid="auth-login-submit"
						className="mt-1 w-full bg-[#496800] hover:bg-[#3a5200] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-200 shadow-[0_4px_20px_rgba(73,104,0,0.30)]"
					>
						Sign In
					</button>
				</form>

				{/* Footer */}
				<p className="text-sm text-center text-[#7a8a60]">
					Don&apos;t have an account?{" "}
					<Link
						href="/signup"
						className="text-[#496800] font-semibold hover:underline underline-offset-2"
					>
						Sign up
					</Link>
				</p>
			</div>

			{/* Decorative label */}
			<p className="text-center text-xs text-[#b5c49a] mt-6 tracking-widest uppercase">
				Build habits. Build yourself.
			</p>
		</div>
	);
}

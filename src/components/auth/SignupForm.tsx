"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/auth";
import Link from "next/link";

export default function SignupForm() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		try {
			signup(email, password);
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
				<div className="flex flex-col items-center gap-3 text-center">
					<div className="w-16 h-16 rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(73,104,0,0.18)]">
						<img
							src="/icons/icon-192x192.png"
							alt="Habit Tracker"
							className="w-full h-full object-cover"
						/>
					</div>
					<div>
						<p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#496800] mb-1">
							Habit Tracker
						</p>
						<h1 className="text-[2rem] font-serif font-bold text-[#1a2400] leading-tight tracking-tight">
							Start your journey
						</h1>
						<p className="text-sm text-[#7a8a60] mt-1">
							Create an account and build lasting habits.
						</p>
					</div>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="signup-email"
							className="text-xs font-semibold tracking-widest uppercase text-[#496800]"
						>
							Email
						</label>
						<input
							id="signup-email"
							data-testid="auth-signup-email"
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
							htmlFor="signup-password"
							className="text-xs font-semibold tracking-widest uppercase text-[#496800]"
						>
							Password
						</label>
						<input
							id="signup-password"
							data-testid="auth-signup-password"
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
						data-testid="auth-signup-submit"
						className="mt-1 w-full bg-[#496800] hover:bg-[#3a5200] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-200 shadow-[0_4px_20px_rgba(73,104,0,0.30)]"
					>
						Create Account
					</button>
				</form>

				{/* Footer */}
				<p className="text-sm text-center text-[#7a8a60]">
					Already have an account?{" "}
					<Link
						href="/login"
						className="text-[#496800] font-semibold hover:underline underline-offset-2"
					>
						Sign in
					</Link>
				</p>
			</div>

			<p className="text-center text-xs text-[#b5c49a] mt-6 tracking-widest uppercase">
				Build habits. Build yourself.
			</p>
		</div>
	);
}

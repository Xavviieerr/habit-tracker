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
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 w-full max-w-sm items-center"
		>
			<img
				src="/icons/icon-192x192.png"
				alt="Habit Tracker"
				className="w-20 h-20 rounded-2xl"
			/>
			<h1 className="text-xl font-semibold">Create Account</h1>

			<input
				type="email"
				placeholder="Email"
				className="border p-2 rounded"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>

			<input
				type="password"
				placeholder="Password"
				className="border p-2 rounded"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>

			{error && <p className="text-red-500 text-sm">{error}</p>}

			<button
				type="submit"
				className="bg-[#496800] text-white py-2 px-3 rounded"
			>
				Sign Up
			</button>
			<p className="text-sm text-center">
				Already have an account?{" "}
				<Link href="/login" className="text-[#496800] hover:underline">
					Login
				</Link>
			</p>
		</form>
	);
}

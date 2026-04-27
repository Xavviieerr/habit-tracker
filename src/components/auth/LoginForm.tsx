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
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 w-full max-w-sm"
		>
			<h1 className="text-xl font-semibold">Login</h1>

			<input
				type="email"
				placeholder="Email"
				className="border p-2 rounded"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>

			<input
				type="password"
				placeholder="Password"
				className="border p-2 rounded"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>

			{error && <p className="text-red-500 text-sm">{error}</p>}

			<button type="submit" className="bg-[#496800] text-white py-2 rounded">
				Login
			</button>
			<p className="text-sm text-center">
				Don`t have an account?{" "}
				<Link href="/signup" className="text-[#496800] hover:underline">
					Sign up
				</Link>
			</p>
		</form>
	);
}

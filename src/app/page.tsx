"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/shared/SplashScreen";
import { getSession } from "@/lib/auth";

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		const start = Date.now();

		const session = getSession();

		const delay = 1000;

		const remainingTime = Math.max(delay - (Date.now() - start), 0);

		setTimeout(() => {
			if (session) {
				router.replace("/dashboard");
			} else {
				router.replace("/login");
			}
		}, remainingTime);
	}, [router]);

	return <SplashScreen />;
}

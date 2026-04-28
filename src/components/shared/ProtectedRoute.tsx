"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import SplashScreen from "./SplashScreen";

export default function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		const session = getSession();
		if (!session) {
			router.replace("/login");
		} else {
			setIsChecking(false);
		}
	}, [router]);

	if (isChecking) {
		return <SplashScreen />;
	}

	return <>{children}</>;
}

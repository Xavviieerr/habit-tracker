"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import HabitForm from "@/components/habits/HabitForm";
import HabitCard from "@/components/habits/HabitCard";
import { getUserHabits } from "@/lib/habits";
import { STORAGE_KEYS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/auth";

export default function HabitList() {
	const router = useRouter();

	const [habits, setHabits] = useState<any[]>([]);
	const [showForm, setShowForm] = useState(false);

	const refresh = () => {
		setHabits(getUserHabits());
	};

	useEffect(() => {
		refresh();
	}, []);

	const logout = () => {
		clearSession();
		router.replace("/login");
	};

	const completedToday = habits.filter((h) =>
		h.completions.includes(new Date().toISOString().slice(0, 10)),
	).length;

	return (
		<ProtectedRoute>
			<div data-testid="dashboard-page" className="min-h-screen bg-[#F5F2EC]">
				{/* Top nav */}
				<header className="bg-white border-b border-[#e8e4dc] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
					<div className="flex items-center gap-3">
						<img
							src="/icons/icon-192x192.png"
							alt="Habit Tracker"
							className="w-8 h-8 rounded-xl"
						/>
						<span className="font-serif font-bold text-[#1a2400] text-lg">
							Habit Tracker
						</span>
					</div>
					<button
						data-testid="auth-logout-button"
						onClick={logout}
						className="text-xs font-semibold text-[#7a8a60] hover:text-[#1a2400] tracking-wide transition-colors px-3 py-1.5 rounded-lg hover:bg-[#F5F2EC]"
					>
						Sign out
					</button>
				</header>

				<main className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-6">
					{/* Summary banner */}
					<div className="bg-[#496800] rounded-2xl px-6 py-5 flex items-center justify-between shadow-[0_4px_24px_rgba(73,104,0,0.20)]">
						<div>
							<p className="text-[#c5dc9a] text-xs font-semibold tracking-widest uppercase mb-1">
								Today&apos;s Progress
							</p>
							<p className="text-white text-2xl font-serif font-bold">
								{completedToday} / {habits.length}
								<span className="text-sm font-sans font-normal text-[#c5dc9a] ml-2">
									habits done
								</span>
							</p>
						</div>
						<div className="text-4xl">
							{completedToday === habits.length && habits.length > 0
								? "🏆"
								: "🌱"}
						</div>
					</div>

					{/* Section header */}
					<div className="flex items-center justify-between">
						<h2 className="font-serif font-bold text-[#1a2400] text-xl">
							My Habits
						</h2>
						<button
							data-testid="create-habit-button"
							onClick={() => setShowForm(true)}
							className="flex items-center gap-1.5 bg-[#496800] hover:bg-[#3a5200] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 shadow-[0_2px_12px_rgba(73,104,0,0.25)] active:scale-[0.97]"
						>
							<span className="text-base leading-none">+</span>
							New Habit
						</button>
					</div>

					{/* Inline form */}
					{showForm && (
						<HabitForm
							onClose={() => {
								setShowForm(false);
								refresh();
							}}
						/>
					)}

					{/* Empty state */}
					{habits.length === 0 && !showForm && (
						<div
							data-testid="empty-state"
							className="flex flex-col items-center justify-center py-16 gap-4 text-center"
						>
							<div className="text-5xl">🌿</div>
							<div>
								<p className="font-serif font-bold text-[#1a2400] text-lg">
									No habits yet
								</p>
								<p className="text-sm text-[#7a8a60] mt-1">
									Create your first habit to get started.
								</p>
							</div>
						</div>
					)}

					{/* Habit cards */}
					<div className="flex flex-col gap-3">
						{habits.map((habit) => (
							<HabitCard key={habit.id} habit={habit} refresh={refresh} />
						))}
					</div>
				</main>
			</div>
		</ProtectedRoute>
	);
}

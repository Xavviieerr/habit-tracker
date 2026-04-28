"use client";

import { useState } from "react";
import { getHabitSlug } from "@/lib/slug";
import { deleteHabit, updateHabit, toggleHabitCompletion } from "@/lib/habits";
import { calculateCurrentStreak } from "@/lib/streaks";

export default function HabitCard({ habit, refresh }: any) {
	const slug = getHabitSlug(habit.name);
	const today = new Date().toISOString().slice(0, 10);

	const [isEditing, setIsEditing] = useState(false);
	const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
	const [name, setName] = useState(habit.name);
	const [description, setDescription] = useState(habit.description);

	const isCompletedToday = habit.completions.includes(today);
	const currentStreak = calculateCurrentStreak(habit.completions, today);

	const handleComplete = () => {
		const updated = toggleHabitCompletion(habit, today);
		updateHabit(updated);
		refresh();
	};

	const handleDelete = () => {
		if (isConfirmingDelete) {
			deleteHabit(habit.id);
			refresh();
		} else {
			setIsConfirmingDelete(true);
		}
	};

	const handleSaveEdit = () => {
		const updatedHabit = { ...habit, name, description, frequency: "daily" };
		updateHabit(updatedHabit);
		setIsEditing(false);
		refresh();
	};

	const inputClass =
		"w-full bg-[#F5F2EC] border border-transparent rounded-xl px-4 py-2.5 text-sm text-[#1a2400] placeholder:text-[#b5c49a] outline-none focus:border-[#496800] focus:bg-white transition-all duration-200";

	return (
		<div
			data-testid={`habit-card-${slug}`}
			className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
				isCompletedToday
					? "bg-[#f0f7e6] border-[#c5dc9a]"
					: "bg-white border-[#e8e4dc]"
			}`}
		>
			{!isEditing ? (
				<div className="p-5 flex flex-col gap-4">
					{/* Top row */}
					<div className="flex items-start justify-between gap-3">
						<div className="flex-1 min-w-0">
							<h3 className="font-serif font-bold text-[#1a2400] text-lg leading-snug truncate">
								{habit.name}
							</h3>
							{habit.description && (
								<p className="text-sm text-[#7a8a60] mt-0.5 line-clamp-2">
									{habit.description}
								</p>
							)}
						</div>

						{/* Streak badge */}
						<div className="flex-shrink-0 flex items-center gap-1.5 bg-[#496800]/10 text-[#496800] rounded-full px-3 py-1">
							<span className="text-base">🔥</span>
							<span
								data-testid={`habit-streak-${slug}`}
								className="text-sm font-bold tabular-nums"
							>
								{currentStreak}
							</span>
							<span className="text-xs font-medium">
								day{currentStreak !== 1 ? "s" : ""}
							</span>
						</div>
					</div>

					{/* Complete button */}
					<button
						data-testid={`habit-complete-${slug}`}
						onClick={handleComplete}
						className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
							isCompletedToday
								? "bg-[#496800] text-white shadow-[0_4px_16px_rgba(73,104,0,0.25)]"
								: "bg-[#F5F2EC] text-[#496800] hover:bg-[#e8e4dc]"
						}`}
					>
						{isCompletedToday ? "✓ Completed Today" : "Mark Complete"}
					</button>

					{/* Edit / Delete row */}
					<div className="flex items-center gap-2">
						<button
							data-testid={`habit-edit-${slug}`}
							onClick={() => setIsEditing(true)}
							className="flex-1 py-2 rounded-xl text-xs font-semibold text-[#7a8a60] bg-[#F5F2EC] hover:bg-[#e8e4dc] transition-colors"
						>
							Edit
						</button>

						{isConfirmingDelete ? (
							<>
								<button
									data-testid="confirm-delete-button"
									onClick={handleDelete}
									className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
								>
									Confirm Delete
								</button>
								<button
									onClick={() => setIsConfirmingDelete(false)}
									className="flex-1 py-2 rounded-xl text-xs font-semibold text-[#7a8a60] bg-[#F5F2EC] hover:bg-[#e8e4dc] transition-colors"
								>
									Cancel
								</button>
							</>
						) : (
							<button
								data-testid={`habit-delete-${slug}`}
								onClick={handleDelete}
								className="flex-1 py-2 rounded-xl text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
							>
								Delete
							</button>
						)}
					</div>
				</div>
			) : (
				<div className="p-5 flex flex-col gap-4">
					<h3 className="font-serif font-bold text-[#1a2400] text-base">
						Edit Habit
					</h3>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor={`edit-name-${habit.id}`}
							className="text-xs font-semibold tracking-widest uppercase text-[#496800]"
						>
							Name
						</label>
						<input
							id={`edit-name-${habit.id}`}
							value={name}
							onChange={(e) => setName(e.target.value)}
							className={inputClass}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor={`edit-description-${habit.id}`}
							className="text-xs font-semibold tracking-widest uppercase text-[#496800]"
						>
							Description
						</label>
						<input
							id={`edit-description-${habit.id}`}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className={inputClass}
						/>
					</div>

					<div className="flex gap-3">
						<button
							onClick={() => {
								setIsEditing(false);
								setName(habit.name);
								setDescription(habit.description);
							}}
							className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#7a8a60] bg-[#F5F2EC] hover:bg-[#e8e4dc] transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={handleSaveEdit}
							className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#496800] hover:bg-[#3a5200] transition-colors shadow-[0_4px_16px_rgba(73,104,0,0.25)]"
						>
							Save
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

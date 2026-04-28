"use client";

import { useState } from "react";
import { createHabit } from "@/lib/habits";
import { getSession } from "@/lib/auth";
import { validateHabitName } from "@/lib/validators";

export default function HabitForm({ onClose }: any) {
	const session = getSession() || null;
	if (!session) return;

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [frequency, setFrequency] = useState("daily");
	const [error, setError] = useState("");

	const handleSubmit = (e: any) => {
		e.preventDefault();

		const result = validateHabitName(name);

		if (!result.valid) {
			setError(result.error!);
			return;
		}

		createHabit({
			userId: session.userId,
			name: result.value,
			description,
			frequency: "daily",
		});

		onClose();
	};

	const inputClass =
		"w-full bg-[#F5F2EC] border border-transparent rounded-xl px-4 py-3 text-sm text-[#1a2400] placeholder:text-[#b5c49a] outline-none focus:border-[#496800] focus:bg-white transition-all duration-200";

	const labelClass =
		"text-xs font-semibold tracking-widest uppercase text-[#496800]";

	return (
		<div className="bg-white rounded-3xl shadow-[0_8px_48px_rgba(73,104,0,0.12)] p-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-7">
				<div>
					<h2 className="text-xl font-serif font-bold text-[#1a2400] leading-tight">
						New Habit
					</h2>
					<p className="text-xs text-[#7a8a60] mt-0.5">
						Small steps, big changes.
					</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F2EC] text-[#7a8a60] hover:bg-[#e8e4dc] transition-colors text-lg leading-none"
					aria-label="Close"
				>
					×
				</button>
			</div>

			<form
				data-testid="habit-form"
				onSubmit={handleSubmit}
				className="flex flex-col gap-5"
			>
				{/* Name */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="habit-name" className={labelClass}>
						Habit Name
					</label>
					<input
						id="habit-name"
						data-testid="habit-name-input"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. Morning run, Read 10 pages…"
						className={inputClass}
					/>
				</div>

				{/* Description */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="habit-description" className={labelClass}>
						Description{" "}
						<span className="normal-case tracking-normal font-normal text-[#b5c49a]">
							(optional)
						</span>
					</label>
					<input
						id="habit-description"
						data-testid="habit-description-input"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Why does this habit matter to you?"
						className={inputClass}
					/>
				</div>

				{/* Frequency */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="habit-frequency" className={labelClass}>
						Frequency
					</label>
					<select
						id="habit-frequency"
						data-testid="habit-frequency-select"
						value={frequency}
						onChange={(e) => setFrequency(e.target.value)}
						className={inputClass}
					>
						<option value="daily">Daily</option>
					</select>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3">
						{error}
					</div>
				)}

				{/* Actions */}
				<div className="flex gap-3 mt-2">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#7a8a60] bg-[#F5F2EC] hover:bg-[#e8e4dc] transition-all duration-200"
					>
						Cancel
					</button>
					<button
						type="submit"
						data-testid="habit-save-button"
						className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-[#496800] hover:bg-[#3a5200] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_16px_rgba(73,104,0,0.25)]"
					>
						Save Habit
					</button>
				</div>
			</form>
		</div>
	);
}

import { STORAGE_KEYS } from "./constants";
import type { Habit } from "@/types/habit";
import { getSession } from "./auth";

function getAllHabits(): Habit[] {
	if (typeof window === "undefined") return [];

	const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
	return raw ? JSON.parse(raw) : [];
}

function saveAll(habits: Habit[]) {
	localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}

// ---------------- CREATE ----------------
export function createHabit(
	data: Omit<Habit, "id" | "createdAt" | "completions">,
) {
	const session = getSession();
	if (!session) return;

	const habits = getAllHabits();

	const newHabit: Habit = {
		...data,
		id: crypto.randomUUID(),
		createdAt: new Date().toISOString(),
		completions: [],
	};

	saveAll([...habits, newHabit]);
}

// ---------------- READ ----------------
export function getUserHabits(): Habit[] {
	const session = getSession();
	if (!session) return [];

	return getAllHabits().filter((h) => h.userId === session.userId);
}

// ---------------- UPDATE (EDIT) ----------------
export function updateHabit(updated: Habit) {
	const raw = localStorage.getItem("habit-tracker-habits");
	const habits: Habit[] = raw ? JSON.parse(raw) : [];

	const next = habits.map((habit) =>
		habit.id === updated.id ? updated : habit,
	);

	localStorage.setItem("habit-tracker-habits", JSON.stringify(next));
}

// ---------------- DELETE ----------------
export function deleteHabit(id: string) {
	const habits = getAllHabits().filter((h) => h.id !== id);
	saveAll(habits);
}

// ---------------- TOGGLE COMPLETION ----------------

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
	const exists = habit.completions.includes(date);

	let updatedCompletions;

	if (exists) {
		// remove
		updatedCompletions = habit.completions.filter((d) => d !== date);
	} else {
		// add
		updatedCompletions = [...habit.completions, date];
	}

	const unique = Array.from(new Set(updatedCompletions));

	return {
		...habit,
		completions: unique,
	};
}

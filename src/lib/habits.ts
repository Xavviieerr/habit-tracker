import { STORAGE_KEYS } from "./constants";
import type { Habit } from "@/types/habit";
import { getSession } from "./auth";
import { getItem, setItem } from "./storage";

function getAllHabits(): Habit[] {
	return getItem<Habit[]>(STORAGE_KEYS.HABITS, []);
}

function saveAll(habits: Habit[]) {
	setItem(STORAGE_KEYS.HABITS, habits);
}

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

export function getUserHabits(): Habit[] {
	const session = getSession();
	if (!session) return [];

	return getAllHabits().filter((h) => h.userId === session.userId);
}

export function updateHabit(updated: Habit) {
	const habits = getAllHabits();

	const next = habits.map((habit) =>
		habit.id === updated.id ? updated : habit,
	);

	saveAll(next);
}

export function deleteHabit(id: string) {
	const habits = getAllHabits().filter((h) => h.id !== id);
	saveAll(habits);
}

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

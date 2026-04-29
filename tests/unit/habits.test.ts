import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	toggleHabitCompletion,
	createHabit,
	getUserHabits,
	updateHabit,
	deleteHabit,
} from "@/lib/habits";
import { Habit } from "@/types/habit";
import * as auth from "@/lib/auth";
import * as storage from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";

vi.mock("@/lib/auth", () => ({
	getSession: vi.fn(),
}));

vi.mock("@/lib/storage", () => ({
	getItem: vi.fn(),
	setItem: vi.fn(),
}));

const baseHabit: Habit = {
	id: "1",
	userId: "u1",
	name: "Test",
	description: "",
	frequency: "daily",
	createdAt: "",
	completions: [],
};

describe("habits.ts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("toggleHabitCompletion", () => {
		it("adds a completion date when the date is not present", () => {
			const result = toggleHabitCompletion(baseHabit, "2026-04-27");
			expect(result.completions).toContain("2026-04-27");
		});

		it("removes a completion date when the date already exists", () => {
			const habit = { ...baseHabit, completions: ["2026-04-27"] };
			const result = toggleHabitCompletion(habit, "2026-04-27");
			expect(result.completions).not.toContain("2026-04-27");
		});

		it("does not mutate the original habit object", () => {
			const original = { ...baseHabit, completions: [] };

			toggleHabitCompletion(original, "2026-04-27");

			expect(original.completions).toEqual([]);
		});

		it("does not return duplicate completion dates", () => {
			const habit = { ...baseHabit, completions: [] };

			const result = toggleHabitCompletion(habit, "2026-04-27");
			const result2 = toggleHabitCompletion(result, "2026-04-27");

			expect(result2.completions.filter((d) => d === "2026-04-27").length).toBe(
				0,
			);
		});
	});

	describe("CRUD operations", () => {
		it("createHabit does nothing if no session", () => {
			vi.mocked(auth.getSession).mockReturnValue(null);

			createHabit({
				userId: "u1",
				name: "New",
				description: "",
				frequency: "daily",
			});

			expect(storage.setItem).not.toHaveBeenCalled();
		});

		it("createHabit saves new habit if session exists", () => {
			vi.mocked(auth.getSession).mockReturnValue({
				userId: "u1",
				email: "t@t.com",
			});

			vi.mocked(storage.getItem).mockReturnValue([]);

			createHabit({
				userId: "u1",
				name: "New",
				description: "",
				frequency: "daily",
			});

			expect(storage.setItem).toHaveBeenCalledWith(
				STORAGE_KEYS.HABITS,
				expect.arrayContaining([
					expect.objectContaining({
						name: "New",
						userId: "u1",
						completions: [],
					}),
				]),
			);
		});

		it("getUserHabits returns only current user's habits", () => {
			vi.mocked(auth.getSession).mockReturnValue({
				userId: "u1",
				email: "t@t.com",
			});

			const habits = [
				{ ...baseHabit, id: "1", userId: "u1" },
				{ ...baseHabit, id: "2", userId: "u2" },
			];

			vi.mocked(storage.getItem).mockReturnValue(habits);

			const result = getUserHabits();

			expect(result).toHaveLength(1);
			expect(result[0].userId).toBe("u1");
		});

		it("updateHabit replaces correct habit without duplicating others", () => {
			const habits = [
				{ ...baseHabit, id: "1", name: "Old" },
				{ ...baseHabit, id: "2", name: "Other" },
			];

			vi.mocked(storage.getItem).mockReturnValue(habits);

			updateHabit({ ...baseHabit, id: "1", name: "Updated" });

			expect(storage.setItem).toHaveBeenCalledWith(
				STORAGE_KEYS.HABITS,
				expect.arrayContaining([
					expect.objectContaining({ id: "1", name: "Updated" }),
					expect.objectContaining({ id: "2", name: "Other" }),
				]),
			);
		});

		it("deleteHabit removes only selected habit", () => {
			const habits = [
				{ ...baseHabit, id: "1" },
				{ ...baseHabit, id: "2" },
			];

			vi.mocked(storage.getItem).mockReturnValue(habits);

			deleteHabit("1");

			expect(storage.setItem).toHaveBeenCalledWith(
				STORAGE_KEYS.HABITS,
				expect.arrayContaining([expect.objectContaining({ id: "2" })]),
			);
		});
	});
});

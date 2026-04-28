import { describe, it, expect } from "vitest";
import { validateHabitName, validateEmail, validatePassword } from "@/lib/validators";

describe("validators.ts", () => {
	describe("validateHabitName", () => {
		it("returns an error when habit name is empty", () => {
			const result = validateHabitName("");
			expect(result.valid).toBe(false);
			expect(result.error).toBe("Habit name is required");
		});

		it("returns an error when habit name exceeds 60 characters", () => {
			const longName = "a".repeat(61);
			const result = validateHabitName(longName);
			expect(result.valid).toBe(false);
		});

		it("returns a trimmed value when habit name is valid", () => {
			const result = validateHabitName("  Read Books  ");
			expect(result.valid).toBe(true);
			expect(result.value).toBe("Read Books");
		});
	});

	describe("validateEmail", () => {
		it("returns null for valid email", () => {
			expect(validateEmail("test@example.com")).toBeNull();
		});

		it("returns error for empty email", () => {
			expect(validateEmail("")).toBe("Email is required");
		});

		it("returns error for invalid format", () => {
			expect(validateEmail("invalid")).toBe("Invalid email address");
		});
	});

	describe("validatePassword", () => {
		it("returns null for valid password", () => {
			expect(validatePassword("password123")).toBeNull();
		});

		it("returns error for empty password", () => {
			expect(validatePassword("")).toBe("Password is required");
		});

		it("returns error for short password", () => {
			expect(validatePassword("12345")).toBe("Password must be at least 6 characters");
		});
	});
});

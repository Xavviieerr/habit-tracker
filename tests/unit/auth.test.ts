import { describe, it, expect, vi, beforeEach } from "vitest";
import { signup, login, getSession, setSession, clearSession } from "@/lib/auth";
import * as storage from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";

vi.mock("@/lib/storage", () => ({
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
}));

describe("auth.ts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Session Management", () => {
		it("getSession calls storage.getItem", () => {
			const session = { userId: "1", email: "test@test.com" };
			vi.mocked(storage.getItem).mockReturnValue(session);
			expect(getSession()).toBe(session);
			expect(storage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.SESSION, null);
		});

		it("setSession calls storage.setItem", () => {
			const session = { userId: "1", email: "test@test.com" };
			setSession(session);
			expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.SESSION, session);
		});

		it("clearSession calls storage.removeItem", () => {
			clearSession();
			expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.SESSION);
		});
	});

	describe("signup", () => {
		it("throws error for invalid email", () => {
			expect(() => signup("invalid", "password")).toThrow("Invalid email address");
		});

		it("throws error for short password", () => {
			expect(() => signup("test@test.com", "123")).toThrow("Password must be at least 6 characters");
		});

		it("throws error if user already exists", () => {
			vi.mocked(storage.getItem).mockReturnValue([{ email: "test@test.com" }]);
			expect(() => signup("test@test.com", "password123")).toThrow("User already exists");
		});

		it("creates new user and sets session on success", () => {
			vi.mocked(storage.getItem).mockReturnValue([]);
			const user = signup("test@test.com", "password123");
			
			expect(user.email).toBe("test@test.com");
			expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.USERS, expect.any(Array));
			expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.SESSION, {
				userId: user.id,
				email: user.email,
			});
		});
	});

	describe("login", () => {
		it("throws error for invalid credentials", () => {
			vi.mocked(storage.getItem).mockReturnValue([]);
			expect(() => login("test@test.com", "password123")).toThrow("Invalid email or password");
		});

		it("throws error for wrong password", () => {
			vi.mocked(storage.getItem).mockReturnValue([{ email: "test@test.com", password: "wrong" }]);
			expect(() => login("test@test.com", "password123")).toThrow("Invalid email or password");
		});

		it("sets session on successful login", () => {
			const user = { id: "1", email: "test@test.com", password: "password123" };
			vi.mocked(storage.getItem).mockReturnValue([user]);
			
			const session = login("test@test.com", "password123");
			expect(session.userId).toBe(user.id);
			expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.SESSION, {
				userId: user.id,
				email: user.email,
			});
		});
	});
});

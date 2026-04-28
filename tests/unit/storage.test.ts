import { describe, it, expect, vi, beforeEach } from "vitest";
import { getItem, setItem, removeItem } from "@/lib/storage";

const localStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: vi.fn((key: string) => store[key] ?? null),

		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),

		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),

		clear: vi.fn(() => {
			store = {};
		}),
	};
})();

describe("storage.ts", () => {
	beforeEach(() => {
		vi.stubGlobal("localStorage", localStorageMock);
		localStorageMock.clear();
		vi.clearAllMocks();
	});

	describe("getItem", () => {
		it("returns fallback when localStorage is not available", () => {
			vi.stubGlobal("localStorage", undefined);
			expect(getItem("key", "fallback")).toBe("fallback");
		});

		it("returns fallback when key does not exist", () => {
			expect(getItem("key", "fallback")).toBe("fallback");
		});

		it("returns fallback when empty string is stored", () => {
			localStorage.setItem("key", "");
			expect(getItem("key", "fallback")).toBe("fallback");
		});

		it("returns parsed value when key exists", () => {
			const data = { foo: "bar" };

			localStorage.setItem("key", JSON.stringify(data));

			expect(getItem("key", "fallback")).toEqual(data);
		});

		it("returns fallback when JSON.parse fails", () => {
			localStorage.setItem("key", "invalid-json");

			expect(getItem("key", "fallback")).toBe("fallback");
		});
	});

	describe("setItem", () => {
		it("does nothing when localStorage is not available", () => {
			vi.stubGlobal("localStorage", undefined);
			setItem("key", "value");
			expect(localStorageMock.setItem).not.toHaveBeenCalled();
		});

		it("stores stringified value in localStorage", () => {
			setItem("key", { foo: "bar" });

			expect(localStorage.getItem("key")).toBe(JSON.stringify({ foo: "bar" }));
		});
	});

	describe("removeItem", () => {
		it("does nothing when localStorage is not available", () => {
			vi.stubGlobal("localStorage", undefined);
			removeItem("key");
			expect(localStorageMock.removeItem).not.toHaveBeenCalled();
		});

		it("removes item from storage", () => {
			localStorage.setItem("key", "value");

			removeItem("key");

			expect(localStorage.getItem("key")).toBe(null);
		});
	});
});

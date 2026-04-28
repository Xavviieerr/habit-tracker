/* MENTOR_TRACE_STAGE3_HABIT_A91 */

import { describe, it, expect } from "vitest";
import { calculateCurrentStreak } from "@/lib/streaks";

describe("calculateCurrentStreak", () => {
	it("returns 0 when completions is empty", () => {
		expect(calculateCurrentStreak([])).toBe(0);
	});

	it("returns 0 when today is not completed", () => {
		expect(calculateCurrentStreak(["2026-04-26"], "2026-04-27")).toBe(0);
	});

	it("returns the correct streak for consecutive completed days", () => {
		const data = ["2026-04-27", "2026-04-26"];
		expect(calculateCurrentStreak(data, "2026-04-27")).toBe(2);
	});

	it("ignores duplicate completion dates", () => {
		const data = ["2026-04-27", "2026-04-27"];
		expect(calculateCurrentStreak(data, "2026-04-27")).toBe(1);
	});

	it("breaks the streak when a calendar day is missing", () => {
		const data = ["2026-04-27", "2026-04-25"];
		expect(calculateCurrentStreak(data, "2026-04-27")).toBe(1);
	});
});

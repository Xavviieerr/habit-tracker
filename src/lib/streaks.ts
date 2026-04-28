export function calculateCurrentStreak(
	completions: string[],
	today?: string,
): number {
	if (!completions || completions.length === 0) return 0;

	const currentDateStr = today || new Date().toISOString().slice(0, 10);

	const uniqueDates = Array.from(new Set(completions)).sort((a, b) =>
		b.localeCompare(a),
	);

	if (!uniqueDates.includes(currentDateStr)) {
		return 0;
	}

	let streak = 0;
	let currentCheckDate = new Date(currentDateStr);

	while (true) {
		const checkDateStr = currentCheckDate.toISOString().slice(0, 10);
		if (uniqueDates.includes(checkDateStr)) {
			streak++;
			currentCheckDate.setDate(currentCheckDate.getDate() - 1);
		} else {
			break;
		}
	}

	return streak;
}

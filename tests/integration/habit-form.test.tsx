import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HabitCard from "@/components/habits/HabitCard";
import HabitForm from "@/components/habits/HabitForm";
import HabitList from "@/components/habits/HabitList";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: vi.fn() }),
}));

const mockSession = { userId: "u1", email: "test@mail.com" };

vi.mock("@/lib/auth", () => ({
	getSession: vi.fn(() => mockSession),
	login: vi.fn(),
	signup: vi.fn(),
	clearSession: vi.fn(),
}));

describe("habit form and list", () => {
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
			clear: () => {
				store = {};
			},
		};
	})();

	beforeEach(() => {
		vi.stubGlobal("localStorage", localStorageMock);
		localStorageMock.clear();
		vi.clearAllMocks();
	});

	it("shows a validation error when habit name is empty", () => {
		const onClose = vi.fn();
		render(<HabitForm onClose={onClose} />);

		fireEvent.click(screen.getByTestId("habit-save-button"));

		expect(screen.getByText(/required/i)).toBeInTheDocument();
	});

	it("creates a new habit and renders it in the list", () => {
		const onClose = vi.fn();

		const { rerender } = render(
			<>
				<HabitForm onClose={onClose} />
				<HabitList />
			</>,
		);

		fireEvent.change(screen.getByTestId("habit-name-input"), {
			target: { value: "Drink Water" },
		});
		fireEvent.change(screen.getByTestId("habit-description-input"), {
			target: { value: "Stay hydrated" },
		});
		fireEvent.click(screen.getByTestId("habit-save-button"));

		// onClose is called — re-render HabitList so it refreshes from storage
		rerender(
			<>
				<HabitList />
			</>,
		);

		expect(screen.getByText("Drink Water")).toBeInTheDocument();
	});

	it("edits an existing habit and preserves immutable fields", () => {
		const habit = {
			id: "1",
			userId: "u1",
			name: "Old Name",
			description: "",
			frequency: "daily",
			createdAt: "2024",
			completions: [],
		};

		localStorageMock.setItem("habit-tracker-habits", JSON.stringify([habit]));

		const refresh = vi.fn();
		render(<HabitCard habit={habit} refresh={refresh} />);

		fireEvent.click(screen.getByTestId("habit-edit-old-name"));

		fireEvent.change(screen.getByTestId("habit-name-input"), {
			target: { value: "New Name" },
		});
		fireEvent.click(screen.getByTestId("habit-save-button"));

		const habits = JSON.parse(
			localStorageMock.getItem("habit-tracker-habits")!,
		);
		expect(habits[0].name).toBe("New Name");
		expect(habits[0].id).toBe("1");
		expect(habits[0].createdAt).toBe("2024");
	});

	it("deletes a habit only after explicit confirmation", () => {
		const habit = {
			id: "1",
			name: "Test",
			userId: "u1",
			description: "",
			frequency: "daily",
			createdAt: "",
			completions: [],
		};

		localStorageMock.setItem("habit-tracker-habits", JSON.stringify([habit]));

		const refresh = vi.fn();
		render(<HabitCard habit={habit} refresh={refresh} />);

		// First click arms the confirmation
		fireEvent.click(screen.getByTestId("habit-delete-test"));
		// Second click actually deletes
		fireEvent.click(screen.getByTestId("confirm-delete-button"));

		const habits = JSON.parse(
			localStorageMock.getItem("habit-tracker-habits")!,
		);
		expect(habits.find((h: any) => h.id === "1")).toBeUndefined();
	});

	it("toggles completion and updates the streak display", () => {
		const habit = {
			id: "1",
			name: "Test",
			userId: "u1",
			description: "",
			frequency: "daily",
			createdAt: "",
			completions: [],
		};

		localStorageMock.setItem("habit-tracker-habits", JSON.stringify([habit]));

		const refresh = vi.fn();
		render(<HabitCard habit={habit} refresh={refresh} />);

		fireEvent.click(screen.getByTestId("habit-complete-test"));

		expect(screen.getByTestId("habit-streak-test")).toBeInTheDocument();
	});

	it("cancels deletion when the cancel button is clicked", () => {
		const habit = {
			id: "1",
			name: "Test",
			userId: "u1",
			description: "",
			frequency: "daily",
			createdAt: "",
			completions: [],
		};

		render(<HabitCard habit={habit} refresh={vi.fn()} />);

		fireEvent.click(screen.getByTestId("habit-delete-test"));
		expect(screen.getByText(/confirm delete/i)).toBeInTheDocument();

		fireEvent.click(screen.getByText(/cancel/i));
		expect(screen.queryByText(/confirm delete/i)).not.toBeInTheDocument();
	});

	it("cancels editing and reverts changes", () => {
		const habit = {
			id: "1",
			name: "Test",
			userId: "u1",
			description: "Old Desc",
			frequency: "daily",
			createdAt: "",
			completions: [],
		};

		render(<HabitCard habit={habit} refresh={vi.fn()} />);

		fireEvent.click(screen.getByTestId("habit-edit-test"));
		fireEvent.change(screen.getByTestId("habit-name-input"), {
			target: { value: "New Name" },
		});
		fireEvent.change(screen.getByTestId("habit-description-input"), {
			target: { value: "New Desc" },
		});

		fireEvent.click(screen.getByTestId("habit-cancel-button"));
		expect(screen.getByText("Test")).toBeInTheDocument();
		expect(screen.queryByText("New Name")).not.toBeInTheDocument();
	});

	it("logs out correctly from the habit list", () => {
		render(<HabitList />);
		fireEvent.click(screen.getByTestId("auth-logout-button"));
		
		const session = localStorageMock.getItem("habit-tracker-session");
		expect(session).toBeNull();
	});

	it("opens and closes the habit form from the list", () => {
		render(<HabitList />);
		
		fireEvent.click(screen.getByTestId("create-habit-button"));
		expect(screen.getByTestId("habit-form")).toBeInTheDocument();

		fireEvent.click(screen.getByLabelText(/close/i));
		expect(screen.queryByTestId("habit-form")).not.toBeInTheDocument();
	});

	it("changes frequency in the habit form", () => {
		render(<HabitForm onClose={vi.fn()} />);
		
		const select = screen.getByTestId("habit-frequency-select");
		fireEvent.change(select, { target: { value: "daily" } });
		expect(select).toHaveValue("daily");
	});

	it("shows the trophy when all habits are completed", () => {
		const today = new Date().toISOString().slice(0, 10);
		const habit = {
			id: "1",
			name: "Test",
			userId: "u1",
			description: "",
			frequency: "daily",
			createdAt: "",
			completions: [today],
		};

		localStorageMock.setItem("habit-tracker-habits", JSON.stringify([habit]));
		render(<HabitList />);
		
		expect(screen.getByText("🏆")).toBeInTheDocument();
	});

	it("renders a completed habit card correctly", () => {
		const today = new Date().toISOString().slice(0, 10);
		const habit = {
			id: "1",
			name: "Test",
			userId: "u1",
			description: "",
			frequency: "daily",
			createdAt: "",
			completions: [today],
		};

		render(<HabitCard habit={habit} refresh={vi.fn()} />);
		expect(screen.getByText(/✓ Completed Today/i)).toBeInTheDocument();
	});
});

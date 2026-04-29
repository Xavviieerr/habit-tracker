import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: vi.fn() }),
}));

describe("auth flow", () => {
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

	it("submits the signup form and creates a session", () => {
		render(<SignupForm />);

		fireEvent.change(screen.getByTestId("auth-signup-email"), {
			target: { value: "test@mail.com" },
		});
		fireEvent.change(screen.getByTestId("auth-signup-password"), {
			target: { value: "123456" },
		});
		fireEvent.click(screen.getByTestId("auth-signup-submit"));

		const session = JSON.parse(
			localStorageMock.getItem("habit-tracker-session")!,
		);
		expect(session.email).toBe("test@mail.com");
	});

	it("shows an error for duplicate signup email", () => {
		localStorageMock.setItem(
			"habit-tracker-users",
			JSON.stringify([{ email: "test@mail.com", password: "123456", id: "1" }]),
		);

		render(<SignupForm />);

		fireEvent.change(screen.getByTestId("auth-signup-email"), {
			target: { value: "test@mail.com" },
		});
		fireEvent.change(screen.getByTestId("auth-signup-password"), {
			target: { value: "123456" },
		});
		fireEvent.click(screen.getByTestId("auth-signup-submit"));

		expect(screen.getByText(/already exists/i)).toBeInTheDocument();
	});

	it("submits the login form and stores the active session", () => {
		localStorageMock.setItem(
			"habit-tracker-users",
			JSON.stringify([{ email: "test@mail.com", password: "123456", id: "1" }]),
		);

		render(<LoginForm />);

		fireEvent.change(screen.getByTestId("auth-login-email"), {
			target: { value: "test@mail.com" },
		});
		fireEvent.change(screen.getByTestId("auth-login-password"), {
			target: { value: "123456" },
		});
		fireEvent.click(screen.getByTestId("auth-login-submit"));

		const session = JSON.parse(
			localStorageMock.getItem("habit-tracker-session")!,
		);
		expect(session.email).toBe("test@mail.com");
	});

	it("shows an error for invalid login credentials", () => {
		render(<LoginForm />);

		fireEvent.change(screen.getByTestId("auth-login-email"), {
			target: { value: "wrong@mail.com" },
		});
		fireEvent.change(screen.getByTestId("auth-login-password"), {
			target: { value: "wrongpassword" },
		});
		fireEvent.click(screen.getByTestId("auth-login-submit"));

		expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
	});
});

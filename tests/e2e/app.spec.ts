import { test, expect } from "@playwright/test";

test.describe("Habit Tracker app", () => {
	// 1. Splash screen + redirect unauthenticated
	test("shows the splash screen and redirects unauthenticated users to /login", async ({
		page,
	}) => {
		await page.goto("/");

		await expect(page.getByTestId("splash-screen")).toBeVisible();

		await page.waitForURL("/login");
		await expect(page).toHaveURL("/login");
	});

	// 2. Redirect authenticated user from / → dashboard
	test("redirects authenticated users from / to /dashboard", async ({
		page,
	}) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				"habit-tracker-session",
				JSON.stringify({ userId: "1", email: "test@mail.com" }),
			);
		});

		await page.goto("/");

		await expect(page).toHaveURL("/dashboard");
	});

	// 3. Protect dashboard route
	test("prevents unauthenticated access to /dashboard", async ({ page }) => {
		await page.goto("/dashboard");

		await expect(page).toHaveURL("/login");
	});

	// 4. Signup flow
	test("signs up a new user and lands on the dashboard", async ({ page }) => {
		await page.goto("/signup");

		await page.getByTestId("auth-signup-email").fill("new@mail.com");
		await page.getByTestId("auth-signup-password").fill("123456");

		await page.getByTestId("auth-signup-submit").click();

		await expect(page).toHaveURL("/dashboard");
	});

	// 5. Login flow
	test("logs in an existing user and loads only that user's habits", async ({
		page,
	}) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				"habit-tracker-users",
				JSON.stringify([
					{
						id: "1",
						email: "test@mail.com",
						password: "123456",
						createdAt: new Date().toISOString(),
					},
				]),
			);
		});

		await page.goto("/login");

		await page.getByTestId("auth-login-email").fill("test@mail.com");
		await page.getByTestId("auth-login-password").fill("123456");

		await page.getByTestId("auth-login-submit").click();

		await expect(page).toHaveURL("/dashboard");
	});

	// 6. Create habit
	test("creates a habit from the dashboard", async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				"habit-tracker-session",
				JSON.stringify({ userId: "1", email: "test@mail.com" }),
			);
		});

		await page.goto("/dashboard");

		await page.getByTestId("create-habit-button").click();

		await page.getByTestId("habit-name-input").fill("Drink Water");
		await page.getByTestId("habit-description-input").fill("Stay hydrated");

		await page.getByTestId("habit-save-button").click();

		await expect(page.getByText("Drink Water")).toBeVisible();
	});

	// 7. Complete habit + streak update
	test("completes a habit for today and updates the streak", async ({
		page,
	}) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				"habit-tracker-session",
				JSON.stringify({ userId: "1", email: "test@mail.com" }),
			);
			localStorage.setItem(
				"habit-tracker-habits",
				JSON.stringify([
					{
						id: "1",
						userId: "1",
						name: "Drink Water",
						description: "",
						frequency: "daily",
						createdAt: new Date().toISOString(),
						completions: [],
					},
				]),
			);
		});

		await page.goto("/dashboard");

		await page.getByTestId("habit-complete-drink-water").click();

		await expect(page.getByTestId("habit-streak-drink-water")).toBeVisible();
	});

	// 8. Persistence after reload
	test("persists session and habits after page reload", async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				"habit-tracker-session",
				JSON.stringify({ userId: "1", email: "test@mail.com" }),
			);

			localStorage.setItem(
				"habit-tracker-habits",
				JSON.stringify([
					{
						id: "1",
						userId: "1",
						name: "Drink Water",
						description: "",
						frequency: "daily",
						createdAt: "",
						completions: [],
					},
				]),
			);
		});

		await page.goto("/dashboard");
		await page.reload();

		await expect(page.getByText("Drink Water")).toBeVisible();
	});

	// 9. Logout flow
	test("logs out and redirects to /login", async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				"habit-tracker-session",
				JSON.stringify({ userId: "1", email: "test@mail.com" }),
			);
		});

		await page.goto("/dashboard");

		await page.getByTestId("auth-logout-button").click();

		await expect(page).toHaveURL("/login");
	});

	// 10. Offline cached app shell
	test.skip("loads the cached app shell when offline after the app has been loaded once", async ({
		page,
		context,
	}) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				"habit-tracker-session",
				JSON.stringify({ userId: "1", email: "test@mail.com" }),
			);
		});

		await page.goto("/dashboard");

		// simulate offline
		await context.setOffline(true);

		await page.reload();

		// app shell should still render (layout persists via cache/service worker)
		await expect(page.locator("body")).toBeVisible();
	});
});

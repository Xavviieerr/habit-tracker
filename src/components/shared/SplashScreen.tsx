export default function SplashScreen() {
	return (
		<div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-black">
			<div className="flex flex-col items-center gap-4">
				<img
					src="/icons/icon-192x192.png"
					alt="Habit Tracker"
					className="w-20 h-20 rounded-2xl"
				/>

				<h1 className="text-xl font-semibold text-gray-900 dark:text-white">
					Habit Tracker
				</h1>
			</div>
		</div>
	);
}

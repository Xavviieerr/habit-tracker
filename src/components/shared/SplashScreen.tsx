export default function SplashScreen() {
	return (
		<div
			data-testid="splash-screen"
			className="h-screen w-screen flex items-center justify-center bg-[#F5F2EC]"
		>
			<div className="flex flex-col items-center gap-5">
				<div className="w-20 h-20 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(73,104,0,0.20)] animate-pulse">
					<img
						src="/icons/icon-192x192.png"
						alt="Habit Tracker"
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="flex flex-col items-center gap-1">
					<h1 className="font-serif font-bold text-[#1a2400] text-xl tracking-tight">
						Habit Tracker
					</h1>
					<p className="text-xs text-[#b5c49a] tracking-widest uppercase">
						Loading…
					</p>
				</div>
			</div>
		</div>
	);
}

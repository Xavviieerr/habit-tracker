import ProtectedRoute from "@/components/shared/ProtectedRoute";

export default function DashboardPage() {
	return (
		<ProtectedRoute>
			<div className="p-6">
				<h1 className="text-2xl font-bold">Dashboard</h1>
			</div>
		</ProtectedRoute>
	);
}

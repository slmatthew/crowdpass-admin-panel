import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import {
	Ticket,
	Users,
	Calendar,
	ShoppingCart,
	Percent,
} from "lucide-react";

export default function DashboardPage() {
	const { data, isLoading } = useDashboardSummary();

	if (isLoading) {
		return <div>Загрузка дашборда...</div>;
	}

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Панель управления</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<SummaryCard
					icon={<Ticket className="text-blue-500" />}
					title="Всего билетов"
					value={data?.totalTickets}
				/>
				<SummaryCard
					icon={<Percent className="text-green-500" />}
					title="Продано билетов"
					value={data?.soldTickets}
				/>
				<SummaryCard
					icon={<Calendar className="text-purple-500" />}
					title="Мероприятий"
					value={data?.totalEvents}
				/>
				<SummaryCard
					icon={<Users className="text-orange-500" />}
					title="Пользователей"
					value={data?.totalUsers}
				/>
				<SummaryCard
					icon={<ShoppingCart className="text-pink-500" />}
					title="Бронирований"
					value={data?.totalBookings}
				/>
			</div>
		</div>
	);
}

function SummaryCard({
	title,
	value,
	icon,
}: {
	title: string;
	value?: number;
	icon?: React.ReactNode;
}) {
	return (
		<div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
			<div className="p-3 bg-gray-100 rounded-full">{icon}</div>
			<div>
				<p className="text-gray-500 text-sm">{title}</p>
				<p className="text-xl font-bold">{value ?? "—"}</p>
			</div>
		</div>
	);
}
import { FC } from "react";
import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import dayjs from "dayjs";

interface Props {
	eventId: number;
}

type SalesData = {
	day: string;
	value: number;
}[];

export const EventSalesChart: FC<Props> = ({ eventId }) => {
	const api = useApiClient();

	const { data, isLoading } = useQuery<SalesData>({
		queryKey: ['event-sales', eventId],
		queryFn: () =>
			api
				.get<SalesData>(`admin/events/${eventId}/sales`)
				.then((res) => res.data),
		staleTime: 1000 * 60 * 10,
	});

	if(isLoading) return <p>Загрузка графика...</p>;
	if(!data || data.length === 0) return <p>Нет данных</p>;

	return (
		<div style={{ width: "100%", height: 300 }}>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="day"
						tickFormatter={(value) => dayjs(value).format("DD.MM")}
					/>
					<YAxis />
					<Tooltip
						formatter={(value: number) => [`${value.toFixed(0)} ₽`, 'Выручка']}
						labelFormatter={(label) =>
							`Дата: ${dayjs(label).format("DD.MM.YYYY")}`
						}
					/>
					<Line
						type="monotone"
						dataKey="value"
						stroke="#0088FE"
						strokeWidth={2}
						dot={{ r: 3 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};
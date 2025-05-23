import { useState } from "react";
import { QrScanner } from "@/components/QrScanner";
import { useApiClient } from "@/hooks/useApiClient";
import { Card } from "@/components/ui/Card";
import { Ticket } from "@/types/models";
import { TicketValidateResponse } from "@/types/api/TicketValidateResponse";
import { InfoBanner } from "@/components/ui/InfoBanner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const getDisplayStatus = (status: Ticket['status']): string => {
  switch(status) {
    case 'AVAILABLE': return 'доступен';
    case 'RESERVED': return 'забронирован';
    case 'SOLD': return 'продан';
    case 'USED': return 'использован';
    default: return status;
  }
};

export default function TicketValidationPage() {
	const api = useApiClient();

	const [ticketCode, setTicketCode] = useState("");
	const [result, setResult] = useState<TicketValidateResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleScan = async (secret: string) => {
		await validate(secret);
	};

	const validate = async (secret?: string, code?: string) => {
		setError(null);
		setResult(null);

		if(!code && !secret) setError('Не указаны данные билета');

		if(secret) {
			try {
				const res = await api.post<TicketValidateResponse>(`admin/dashboard/validate-ticket`, { secret });
				setResult(res.data);
			} catch(err: any) {
				setError(err?.response?.data?.message || "Ошибка при проверке билета");
			}
		} else if(code) {
			if(!/^\d+-\d+$/.test(code)) {
				setError("Неверный формат кода");
				return;
			}

			try {
				const res = await api.post<TicketValidateResponse>(`admin/dashboard/validate-ticket`, {
					ticketCode: code,
				});
				setResult(res.data);
			} catch (err: any) {
				setError(err?.response?.data?.message || "Ошибка при проверке билета");
			}
		}
	};

	const makeTicketUsed = async () => {
		if(result) {
			try {
				const res = await api.post<TicketValidateResponse>('admin/dashboard/validate-ticket', {
					secret: result.secret,
					makeUsed: '1'
				});
				
				if(res.data.status === 'USED') {
					toast.success('Проход подтверджён');
					setResult(null);
					setError(null);
				} else throw new Error;
			} catch(err: any) {
				if(err instanceof AxiosError) {
					if(err.response?.data.message) {
						return toast.error(err.response.data.message);
					}
				}

				return toast.error('Произошла ошибка');
			}
		}
	};

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Проверка билета</h1>

			<div>
				<label className="block font-medium mb-1">Сканировать QR-код:</label>
				<QrScanner onScan={handleScan} />
			</div>

			<div>
				<label className="block font-medium mb-1">Или ввести вручную:</label>
				<input
					type="text"
					placeholder="Пример: 17-123"
					className="input w-full"
					value={ticketCode}
					onChange={(e) => setTicketCode(e.target.value)}
				/>
				<button
					onClick={() => validate(undefined, ticketCode)}
					className="btn-primary mt-2"
				>
					Проверить
				</button>
			</div>

			{error && <p className="text-red-500 font-medium">{error}</p>}

			{result && (
				<Card>
					<h2 className="text-lg font-semibold">Билет №{result.event.id}-{result.ticketId}</h2>
					{ticketCode.length > 0 && result.allowed && (
						<InfoBanner
							title="Будьте внимательны"
							message="Обязательно попросите показать этот билет – возможно, человек просто угадал номер билета"
							variant="warning"
							dismissible
						/>
					)}
					<div className="flex items-center gap-2 text-gray-600 text-sm">
						Мероприятие: <Link
							to={`/events/${result.event.id}`}
							className="text-blue-500 hover:underline hover:cursor-pointer"
						>{result.event.name}</Link>
					</div>
					<div className="flex items-center gap-2 text-gray-600 text-sm">
						{result.ticketType.name} за {result.ticketType.price} ₽, билет {getDisplayStatus(result.status)}
					</div>
					<div className="flex items-center gap-2 text-gray-600 text-sm">
						{result.allowed && <span className="text-green-500">Проход разрешён</span>}
						{!result.allowed && <span className="text-red-500">Проход запрещён</span>}
					</div>
					{result.allowed && (
						<div className="flex items-center gap-2 text-gray-600 text-sm">
							<Button
								onClick={() => makeTicketUsed()}
								size="sm"
							>
								Подтвердить проход
							</Button>
						</div>
					)}
				</Card>
			)}
		</div>
	);
}
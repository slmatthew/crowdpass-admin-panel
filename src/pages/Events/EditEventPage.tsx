import { useApiClient } from "@/hooks/useApiClient";
import { EventForm, EventFormData, EventFormValues } from "@/components/events/EventForm";
import { Event } from "@/types/models/Event";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BackButton } from "@/components/ui/BackButton";

export default function EditEventPage() {
  const api = useApiClient();
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<Partial<EventFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const event = await api.get<Event>(`admin/events/${id}`).then((res) => res.data);
      setInitial({
        name: event.name,
        description: event.description,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        organizerId: String(event.organizerId),
        categoryId: String(event.categoryId),
        subcategoryId: String(event.subcategoryId),
      });

      setLoading(false);
    })();
  }, [id]);

  const handleSubmit = async (data: EventFormValues) => {
    try {
      setSaving(true);
      await api.patch(`admin/events/${id}`, data);
      toast.success("Сохранено успешно");
    } catch(err) {
      console.error(err);
      toast.error("Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <BackButton />

      <h1 className="text-2xl font-bold">Редактирование мероприятия</h1>
      <EventForm initialValues={{
        ...initial!,
        startDate: initial?.startDate ? new Date(initial!.startDate).toISOString().slice(0, 16) : undefined,
        endDate: initial?.endDate ? new Date(initial!.endDate).toISOString().slice(0, 16) : undefined,
      }} onSubmit={handleSubmit} isSubmitting={saving} />
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { useApiClient } from "@/hooks/useApiClient";
import { EventForm, EventFormData } from "@/components/events/EventForm";
import { Event } from "@/types/models/Event";
import { useState } from "react";
import toast from "react-hot-toast";
import { BackButton } from "@/components/ui/BackButton";

export default function CreateEventPage() {
  const api = useApiClient();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: EventFormData) => {
    try {
      setSaving(true);
      const created = await api.post<Event>("admin/events", data).then((res) => res.data);
      toast.success("Мероприятие создано");
      navigate(`/events/${created.id}`);
    } catch(err) {
      console.error(err);
      toast.error("Ошибка при создании");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <BackButton />

      <h1 className="text-2xl font-bold">Создать мероприятие</h1>
      <EventForm onSubmit={handleSubmit} isSubmitting={saving} />
    </div>
  );
}
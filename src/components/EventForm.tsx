import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  Controller,
} from "react-hook-form";
import { useEffect, useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";

// Схема
export const eventSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(2),
  startDate: z.preprocess((val) => new Date(String(val)), z.date()),
  endDate: z.preprocess((val) => new Date(String(val)), z.date()),
  organizerId: z.string().min(1),
  categoryId: z.string().min(1),
  subcategoryId: z.string().min(1),
});

export type EventFormData = z.infer<typeof eventSchema>;

interface Props {
  initialValues?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function EventForm({ initialValues, onSubmit, isSubmitting }: Props) {
  const api = useApiClient();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {},
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [organizers, setOrganizers] = useState<any[]>([]);

  const selectedCategoryId = watch("categoryId");

  useUnsavedChangesWarning(isDirty);

  // Загружаем категории и организаторов
  useEffect(() => {
    (async () => {
      const [cats, orgs] = await Promise.all([
        api.get("admin/categories").then((res) => res.data),
        api.get("admin/dashboard/metadata/organizers").then((res) => res.data),
      ]);
      setCategories(cats);
      setOrganizers(orgs);
    })();
  }, []);

  // Загружаем подкатегории при выборе категории
  useEffect(() => {
    if (!selectedCategoryId) return;
    (async () => {
      const subs = await api
        .get(
          `admin/categories/${selectedCategoryId}/subcategories`
        )
        .then((res) => res.data);
      setSubcategories(subs);
    })();
  }, [selectedCategoryId]);

  // Устанавливаем значения после загрузки зависимостей
  useEffect(() => {
    if (
      !initialValues ||
      categories.length === 0 ||
      organizers.length === 0
    )
      return;

    const toInputDatetimeLocal = (date: Date) => {
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    reset({
      ...initialValues,
      startDate: initialValues.startDate
        ? toInputDatetimeLocal(initialValues.startDate)
        : undefined,
      endDate: initialValues.endDate
        ? toInputDatetimeLocal(initialValues.endDate)
        : undefined,
      organizerId: initialValues.organizerId ?? "",
      categoryId: initialValues.categoryId ?? "",
      subcategoryId: initialValues.subcategoryId ?? "",
    });
  }, [initialValues, categories, organizers, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("name")} className="input w-full" placeholder="Название" />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <textarea {...register("description")} className="input w-full" placeholder="Описание" />
      {errors.description && <p className="text-red-500">{errors.description.message}</p>}

      <input {...register("location")} className="input w-full" placeholder="Локация" />
      {errors.location && <p className="text-red-500">{errors.location.message}</p>}

      <input type="datetime-local" {...register("startDate")} className="input w-full" />
      {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}

      <input type="datetime-local" {...register("endDate")} className="input w-full" />
      {errors.endDate && <p className="text-red-500">{errors.endDate.message}</p>}

      <Controller
        name="organizerId"
        control={control}
        render={({ field }) => (
          <select {...field} className="select w-full">
            <option value="">Организатор</option>
            {organizers.map((org) => (
              <option key={org.id} value={org.id.toString()}>
                {org.name}
              </option>
            ))}
          </select>
        )}
      />
      {errors.organizerId && <p className="text-red-500">{errors.organizerId.message}</p>}

      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <select {...field} className="select w-full">
            <option value="">Категория</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      />
      {errors.categoryId && <p className="text-red-500">{errors.categoryId.message}</p>}

      <Controller
        name="subcategoryId"
        control={control}
        render={({ field }) => (
          <select {...field} className="select w-full" disabled={!selectedCategoryId}>
            <option value="">Подкатегория</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id.toString()}>
                {sub.name}
              </option>
            ))}
          </select>
        )}
      />
      {errors.subcategoryId && <p className="text-red-500">{errors.subcategoryId.message}</p>}

      <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? "Сохранение..." : "Сохранить"}
      </button>
    </form>
  );
}

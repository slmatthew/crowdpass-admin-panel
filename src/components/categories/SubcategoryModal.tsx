import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "../ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, "Название обязательно"),
  categoryId: z.number(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
  mode: "create" | "edit";
  categoryOptions: { id: number; name: string }[];
}

export function SubcategoryModal({ open, onClose, onSubmit, initialData, mode, categoryOptions }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || "",
      categoryId: initialData?.categoryId || categoryOptions[0]?.id || 0,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: initialData?.name || "",
        categoryId: initialData?.categoryId || categoryOptions[0]?.id || 0,
      });
    }
  }, [initialData, open, categoryOptions, form.reset]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm">
          <DialogTitle className="text-lg font-medium mb-4">
            {mode === "create" ? "Создание подкатегории" : "Редактирование подкатегории"}
          </DialogTitle>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <input className="input" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Категория</label>
              <select className="select" {...form.register("categoryId", { valueAsNumber: true })}>
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>Отмена</Button>
              <Button type="submit" isLoading={form.formState.isSubmitting}>
                {mode === "create" ? "Создать" : "Сохранить"}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

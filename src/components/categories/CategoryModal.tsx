import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, "Название обязательно"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: { name: string };
  mode: "create" | "edit";
}

export function CategoryModal({ open, onClose, onSubmit, initialData, mode }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || { name: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset(initialData || { name: "" });
    }
  }, [initialData, open, form.reset]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm">
          <DialogTitle className="text-lg font-medium mb-4">
            {mode === "create" ? "Создание категории" : "Редактирование категории"}
          </DialogTitle>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <input className="input" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" size="sm" variant="secondary" onClick={onClose}>Отмена</Button>
              <Button type="submit" size="sm" isLoading={form.formState.isSubmitting}>
                {mode === "create" ? "Создать" : "Сохранить"}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

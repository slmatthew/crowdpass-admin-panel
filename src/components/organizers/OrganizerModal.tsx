import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/Button";

const schema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  contacts: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
}

export function OrganizerModal({ open, onClose, onSubmit, initialData }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || { name: "", description: "", contacts: "" },
  });

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
          <DialogTitle className="text-lg font-medium mb-4">Редактирование организатора</DialogTitle>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <input className="input" {...form.register("name")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Описание</label>
              <textarea className="input" {...form.register("description")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Контакты</label>
              <input className="input" {...form.register("contacts")} />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" type="button" onClick={onClose}>Отмена</Button>
              <Button type="submit" isLoading={form.formState.isSubmitting}>Сохранить</Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, "Укажите название"),
  price: z.number().min(0, "Цена не может быть отрицательной"),
  quantity: z.number().int().min(1, "Укажите количество"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: FormData;
  mode: "create" | "edit";
}

export function TicketTypeModal({ open, onClose, onSubmit, initialData, mode }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", price: 0, quantity: 0 },
  });
  
  useEffect(() => {
    if(initialData) {
      form.reset(initialData);
    }
  }, [initialData]);  

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm">
          <DialogTitle className="text-lg font-medium mb-4">
            {mode === "create" ? "Создание типа билета" : "Редактирование типа билета"}
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
              <label className="block text-sm font-medium mb-1">Цена, ₽</label>
              <input type="number" className="input" {...form.register("price", { valueAsNumber: true })} />
              {form.formState.errors.price && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Количество</label>
              <input type="number" className="input" {...form.register("quantity", { valueAsNumber: true })} />
              {form.formState.errors.quantity && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.quantity.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={onClose}>Отмена</Button>
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
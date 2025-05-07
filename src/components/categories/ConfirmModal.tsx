import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from '@/components/ui/Button';

interface ConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
}

export function ConfirmModal({ open, onClose, onConfirm, title, description }: ConfirmProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm">
          <DialogTitle className="text-lg font-medium mb-2">{title}</DialogTitle>
          {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Отмена</Button>
            <Button variant="destructive" onClick={onConfirm}>Удалить</Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

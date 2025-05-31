import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "@/components/ui/Button";
import { Organizer } from "@/types/models";
import { IconRow } from "../ui/IconRow";
import { Text, AtSign } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  organizer: Organizer;
}

export function OrganizerModal({ open, onClose, organizer }: Props) {
  const navigate = useNavigate();

  const goEntity = () => {
    onClose();
    navigate(`/organizers/${organizer.id}`);
  };
  
  const hasDescription = organizer.description && organizer.description.length > 0;
  const hasContact = organizer.contacts && organizer.contacts.length > 0;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
          <DialogTitle className="text-lg font-semibold">
            {organizer.name} <span className="text-gray-500 text-sm">#{organizer.id}</span>
          </DialogTitle>

          <IconRow
            className="pt-4 border-t border-gray-200 space-y-1"
            icon={<Text size={18} />}
            text={hasDescription ? organizer.description : <i>Описание не указано</i>}
          />
          <IconRow icon={<AtSign size={18} />} text={hasContact ? organizer.contacts : <i>Контакты не указаны</i>} />

          <div className="pt-4 flex justify-end">
            <Button variant="secondary" size="sm" onClick={onClose}>Закрыть</Button>
            <Button variant="primary" size="sm" className="ml-2" onClick={goEntity}>Перейти</Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
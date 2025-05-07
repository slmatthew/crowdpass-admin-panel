import { useModals } from "@/context/ModalContext";
import { UserModal } from "./UserModal";
import { Organizer, User } from "@/types/models";
import { OrganizerModal } from "./OrganizerModal";

export function GlobalModals() {
  const { modal, closeModal } = useModals();

  return (
    <>
      {modal.type === "user" && (
        <UserModal open onClose={closeModal} user={modal.entity as User} />
      )}
      {modal.type === "organizer" && (
        <OrganizerModal open onClose={closeModal} organizer={modal.entity as Organizer} />
      )}
    </>
  );
}
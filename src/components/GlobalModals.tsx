import { useModals } from "@/context/ModalContext";
import { UserModal } from "./users/UserModal";
import { User } from "@/types/models";

export function GlobalModals() {
  const { modal, closeModal } = useModals();

  return (
    <>
      {modal.type === "user" && (
        <UserModal open onClose={closeModal} user={modal.entity as User} />
      )}
    </>
  );
}
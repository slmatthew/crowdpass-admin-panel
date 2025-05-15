import { GlobalModals } from "@/components/modals/GlobalModals";
import { createContext, useContext, useState } from "react";

type ModalType = "user" | "organizer" | null;

interface ModalState {
  type: ModalType;
  entity: any;
}

interface ModalContextValue {
  openModal: (type: ModalType, entity?: any) => void;
  closeModal: () => void;
  modal: ModalState;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState>({ type: null, entity: null });

  const openModal = (type: ModalType, entity: any) => {
    setModal({ type, entity });
  };

  const closeModal = () => setModal({ type: null, entity: null });

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modal }}>
      {children}
      <GlobalModals />
    </ModalContext.Provider>
  );
}

export function useModals() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModals must be used within ModalProvider");
  return context;
}
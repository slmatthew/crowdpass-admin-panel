import { useEffect } from "react";

/**
 * Блокирует выход со страницы, если есть несохранённые изменения
 */
export function useUnsavedChangesWarning(shouldWarn: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldWarn) return;
      e.preventDefault();
      e.returnValue = "";
    };

    const handleClick = (e: MouseEvent) => {
      if (!shouldWarn) return;

      const target = e.target as HTMLElement;
      if (target.closest("a")) {
        const confirmed = window.confirm("У вас есть несохранённые изменения. Уйти со страницы?");
        if (!confirmed) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClick, true);
    };
  }, [shouldWarn]);
}
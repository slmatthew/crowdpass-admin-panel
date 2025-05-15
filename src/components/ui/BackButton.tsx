import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { useIsMobile } from "@/hooks/useIsMobile";

export function BackButton() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if(isMobile) return null;

  return (
    <div className="mb-4">
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft size={16} />}
        onClick={() => navigate(-1)}
      >
        Назад
      </Button>
    </div>
  );
}
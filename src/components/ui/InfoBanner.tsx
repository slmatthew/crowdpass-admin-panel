import { X, XCircle, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/utils/utils";
import React, { useState } from "react";

type BannerVariant = "info" | "warning" | "success" | "error";

interface InfoBannerProps {
  title?: string;
  message: string;
  variant?: BannerVariant;
  className?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
}

const variantStyles: Record<BannerVariant, string> = {
  info: "bg-blue-50 text-blue-800 border-blue-200",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  success: "bg-green-50 text-green-800 border-green-200",
  error: "bg-red-50 text-red-800 border-red-200",
};

const variantIcons: Record<BannerVariant, React.ReactNode> = {
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
};

export function InfoBanner({
  title,
  message,
  variant = "info",
  className,
  icon,
  dismissible = false,
}: InfoBannerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div
      className={cn(
        "border px-4 py-3 rounded-md flex items-start justify-between gap-3 text-sm relative",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex gap-3">
        <div className="pt-0.5">{icon || variantIcons[variant]}</div>
        <div>
          {title && <p className="font-medium mb-0.5">{title}</p>}
          <p>{message}</p>
        </div>
      </div>

      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className="text-inherit absolute top-2 right-2 hover:opacity-70 transition"
          aria-label="Закрыть"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
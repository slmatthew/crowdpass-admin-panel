import { cn } from "@/utils/utils";
import React from "react";

interface IconRowProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  text?: string;
  href?: string;
  muted?: boolean;
}

export function IconRow({
  icon,
  text,
  href,
  muted = false,
  className,
  ...props
}: IconRowProps) {
  const content = (
    <span className={cn("text-sm leading-snug", muted && "text-gray-500")}>{text}</span>
  );

  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <div className="text-gray-500 pt-1">{icon}</div>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
          {text}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
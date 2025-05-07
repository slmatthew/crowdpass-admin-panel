import { cn } from "@/utils/utils";
import React from "react";

export function CardButton({
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("bg-white rounded-md shadow-sm px-3 py-1 flex flex-col gap-2 hover:cursor-pointer hover:shadow-md transition text-sm", className)}
      {...props}
    />
  );
}
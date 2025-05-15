import { cn } from "@/utils/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-md transition", className)} {...props} />;
}
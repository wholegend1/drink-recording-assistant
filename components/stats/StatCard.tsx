import clsx from "clsx";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  color?: "primary" | "accent" | "default";
  className?: string;
}

export function StatCard({
  title,
  value,
  unit,
  icon,
  color = "default",
  className,
}: StatCardProps) {
  const colorStyles = {
    primary: "text-primary",
    accent: "text-accent",
    default: "text-text", // 這會自動適應深色模式 (淺灰 -> 深灰)
  };

  return (
    <div className={clsx("ios-card flex flex-col justify-between", className)}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-text-sub">{title}</span>
        {icon && (
          <span className="text-gray-300 dark:text-gray-600">{icon}</span>
        )}
      </div>
      <div className="flex items-end gap-1">
        <span className={clsx("text-2xl font-extrabold", colorStyles[color])}>
          {value}
        </span>
        {unit && (
          <span className="text-xs text-text-sub font-medium mb-1">{unit}</span>
        )}
      </div>
    </div>
  );
}

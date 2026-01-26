import clsx from "clsx";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      // 使用我們定義好的 ios-card class
      className={clsx(
        "ios-card",
        onClick && "cursor-pointer active:scale-[0.98] transition-transform",
        className,
      )}
    >
      {children}
    </div>
  );
}

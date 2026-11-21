"use client";

import { ReactNode } from "react";

interface BaseCardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function BaseCard({
  children,
  header,
  footer,
  className = "",
  compact = false,
}: BaseCardProps) {
  // Padding based on compact mode
  const padding = compact ? "px-3 py-2" : "px-4 py-3";
  
  return (
    <div
      className={`rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {/* Header */}
      {header && (
        <div className={`${padding} border-b border-border`}>
          {header}
        </div>
      )}
      
      {/* Content */}
      <div className={padding}>
        {children}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className={`${padding} border-t border-border`}>
          {footer}
        </div>
      )}
    </div>
  );
}

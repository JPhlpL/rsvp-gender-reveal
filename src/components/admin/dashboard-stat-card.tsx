import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface DashboardStatCardProps {
  title: string;
  value: ReactNode;
  subtitle?: ReactNode;
  /** Short plain-text explanation; shown on hover/focus via native tooltip. */
  infoTooltip?: string;
  icon: LucideIcon;
  iconColor: string;
  bgGradient: string;
  onClick?: () => void;
  isExpanded?: boolean;
  isClickable?: boolean;
}

export function DashboardStatCard({
  title,
  value,
  subtitle,
  infoTooltip,
  icon: Icon,
  iconColor,
  bgGradient,
  onClick,
  isExpanded = false,
  isClickable = false,
}: DashboardStatCardProps) {
  return (
    <Card 
      className={`relative overflow-hidden transition-all ${
        isClickable 
          ? "cursor-pointer hover:shadow-lg hover:scale-105" 
          : "hover:shadow-lg"
      } ${bgGradient} ${isExpanded ? "ring-2 ring-primary" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1.5 min-w-0">
          <span className="leading-tight">{title}</span>
          {infoTooltip ? (
            <span
              className="inline-flex shrink-0 touch-manipulation"
              title={infoTooltip}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <HelpCircle
                className="h-3.5 w-3.5 text-muted-foreground"
                aria-label={infoTooltip}
                role="img"
              />
            </span>
          ) : null}
        </CardTitle>
        <div className="flex items-center gap-2 shrink-0">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {isClickable && (
            isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold tabular-nums leading-tight break-words">
          {value}
        </div>
        {subtitle != null && subtitle !== "" && (
          <div className="text-sm text-muted-foreground mt-1 space-y-1">{subtitle}</div>
        )}
      </CardContent>
    </Card>
  );
}

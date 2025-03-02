
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string;
  description: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  className?: string;
}

const AnalyticsCard = ({
  title,
  value,
  description,
  change,
  changeType,
  icon,
  className
}: AnalyticsCardProps) => {
  return (
    <div className={cn("bg-card rounded-lg shadow-sm overflow-hidden border border-border", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
          <div className="text-muted-foreground bg-muted rounded-full p-2">
            {icon}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold">{value}</div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className={cn(
          "flex items-center mt-4 text-sm font-medium px-2.5 py-0.5 rounded-full w-fit",
          changeType === "positive" && "text-green-500 bg-green-500/10",
          changeType === "negative" && "text-red-500 bg-red-500/10",
          changeType === "neutral" && "text-blue-500 bg-blue-500/10",
        )}>
          <ArrowUpRight className={cn(
            "h-3 w-3 mr-1",
            changeType === "negative" && "transform rotate-90"
          )} />
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const StatsCard = ({ title, value, description, icon: Icon, trend = "neutral", trendValue }: StatsCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up": return "text-success";
      case "down": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center space-x-1 text-xs">
          <p className="text-muted-foreground">{description}</p>
          {trendValue && (
            <span className={getTrendColor()}>
              {trend === "up" ? "↗" : trend === "down" ? "↙" : ""} {trendValue}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
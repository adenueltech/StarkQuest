import { Badge } from "@/components/ui/badge";
import { Star, Shield, Crown, Award } from "lucide-react";

interface ReputationBadgeProps {
  reputation: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ReputationBadge({
  reputation,
  showIcon = true,
  size = "sm",
}: ReputationBadgeProps) {
  const getReputationTier = (rep: number) => {
    if (rep >= 4.9)
      return {
        tier: "Legendary",
        color: "bg-gradient-to-r from-yellow-400 to-orange-500",
        icon: Crown,
      };
    if (rep >= 4.7)
      return {
        tier: "team",
        color: "bg-gradient-to-r from-purple-400 to-pink-500",
        icon: Award,
      };
    if (rep >= 4.5)
      return {
        tier: "Professional",
        color: "bg-gradient-to-r from-blue-400 to-cyan-500",
        icon: Shield,
      };
    if (rep >= 4.0)
      return {
        tier: "Skilled",
        color: "bg-gradient-to-r from-green-400 to-blue-500",
        icon: Star,
      };
    return { tier: "Newcomer", color: "bg-gray-100 text-gray-800", icon: Star };
  };

  const { tier, color, icon: Icon } = getReputationTier(reputation);

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  return (
    <Badge
      className={`${color} text-white ${sizeClasses[size]} flex items-center space-x-1`}
    >
      {showIcon && (
        <Icon
          className={`${
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"
          }`}
        />
      )}
      <span>{tier}</span>
    </Badge>
  );
}

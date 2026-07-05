"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Heart, Baby } from "lucide-react";
import type { FamilyNodeData } from "@/types";

const FamilyMemberNode = memo(({ data, selected }: NodeProps<FamilyNodeData>) => {
  const genderColor = {
    Male: "border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-700",
    Female: "border-pink-300 bg-pink-50 dark:bg-pink-950 dark:border-pink-700",
    Other: "border-gray-300 bg-gray-50 dark:bg-gray-950 dark:border-gray-700",
  };

  const genderIcon = {
    Male: <User className="h-3 w-3 text-blue-500" />,
    Female: <Heart className="h-3 w-3 text-pink-500" />,
    Other: <Baby className="h-3 w-3 text-gray-500" />,
  };

  const getInitials = () => {
    return `${data.firstName[0] || ""}${data.lastName[0] || ""}`.toUpperCase();
  };

  const getYearRange = () => {
    if (!data.birthDate && !data.deathDate) return null;
    const birth = data.birthDate ? new Date(data.birthDate).getFullYear() : "?";
    const death = data.deathDate
      ? new Date(data.deathDate).getFullYear()
      : data.isAlive
      ? null
      : "?";
    return death ? `${birth} - ${death}` : `${birth} - `;
  };

  return (
    <div
      className={`
        relative rounded-xl border-2 shadow-md p-3 min-w-[160px] max-w-[200px]
        transition-all duration-200 cursor-pointer
        ${genderColor[data.gender]}
        ${selected ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-lg"}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-muted-foreground !w-2 !h-2 !border-2 !border-background"
      />

      <div className="flex flex-col items-center text-center gap-2">
        <Avatar className="h-14 w-14 border-2 border-background">
          <AvatarImage src={data.profileImageUrl || undefined} alt={data.label} />
          <AvatarFallback className="text-sm font-semibold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="flex items-center justify-center gap-1">
            {genderIcon[data.gender]}
            <p className="font-semibold text-sm leading-tight">{data.firstName}</p>
          </div>
          <p className="text-xs text-muted-foreground leading-tight">{data.lastName}</p>
          {getYearRange() && (
            <p className="text-[10px] text-muted-foreground mt-0.5">{getYearRange()}</p>
          )}
        </div>

        {!data.isAlive && data.deathDate && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-gray-400 rounded-full border border-background" />
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-muted-foreground !w-2 !h-2 !border-2 !border-background"
      />
    </div>
  );
});

FamilyMemberNode.displayName = "FamilyMemberNode";

export default FamilyMemberNode;

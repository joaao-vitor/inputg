import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { X } from "lucide-react";
import React from "react";

export const SelectFilter = ({
  label,
  icon,
  onValueChange,
  value = [],
  items = [],
  placeholder,
}: {
  label: string;
  icon?: React.ReactNode;
  onValueChange: (value: string[]) => void;
  value: string[];
  items?: { value: string; label: string }[];
  placeholder: string;
}) => {
  const handleRemove = (slugToRemove: string) => {
    onValueChange(value.filter((slug) => slug !== slugToRemove));
  };

  const lookup = items.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="flex flex-col gap-4">
      <div className="font-semibold text-muted-foreground flex items-center gap-2">
        {icon}
        {label}
      </div>
      <Select
        multiple
        onValueChange={onValueChange}
        value={value}
        items={items}
      >
        <SelectTrigger className={"w-full"}>{placeholder}</SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex gap-4 flex-wrap">
        {value.map((slug) => (
          <Badge
            variant={"outline"}
            className="cursor-pointer hover:border-red-700 hover:bg-muted transition-all duration-300 group"
            onClick={() => handleRemove(slug)}
            key={slug}
          >
            {lookup[slug] || slug}
            <X className="group-hover:text-red-700 ml-1 h-3 w-3" />
          </Badge>
        ))}
      </div>
    </div>
  );
};
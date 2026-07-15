import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LucideIcon } from "lucide-react";

interface SwitchEntregueProps {
  label?: string;
  icon?: LucideIcon;
  isChecked?: boolean;
  color?:string;
  handleClick?: (checked: boolean) => void;
}

export function SwitchEntregue({
  label = "",
  icon: Icon,
  isChecked,
  color = "",
  handleClick,
}: SwitchEntregueProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        tabIndex={-1}
        id="entregue-mode"
        checked={isChecked}
        onCheckedChange={handleClick}
        className={color}
      />
      <Label htmlFor="entregue-mode">
        {label}
        {Icon && <Icon size={16} strokeWidth={1.5} />}
      </Label>
    </div>
  );
}

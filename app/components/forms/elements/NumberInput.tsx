import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormElement, FormElementType } from "@/types/form";

function isNumberElement(element: FormElement): element is FormElement & {
  type: FormElementType.NUMBER;
  properties: {
    min?: number;
    max?: number;
    step?: number;
    prefix?: string;
    suffix?: string;
  };
} {
  return element.type === FormElementType.NUMBER;
}

interface NumberInputProps {
  element: FormElement;
  value: number;
  onChange: (value: number) => void;
}

export function NumberInput({ element, value, onChange }: NumberInputProps) {
  if (!isNumberElement(element)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label>
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        {element.properties.prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {element.properties.prefix}
          </span>
        )}
        <Input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          min={element.properties.min}
          max={element.properties.max}
          step={element.properties.step}
          className={cn(
            element.properties.prefix && "pl-7",
            element.properties.suffix && "pr-7"
          )}
        />
        {element.properties.suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {element.properties.suffix}
          </span>
        )}
      </div>
    </div>
  );
}

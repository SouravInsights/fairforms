import { FormElement, FormElementType } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function isEmailElement(element: FormElement): element is FormElement & {
  type: FormElementType.EMAIL;
  properties: { placeholder: string; validationRegex?: string };
} {
  return element.type === FormElementType.EMAIL;
}

interface EmailInputProps {
  element: FormElement;
  value: string;
  onChange: (value: string) => void;
}

export function EmailInput({ element, value, onChange }: EmailInputProps) {
  if (!isEmailElement(element)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label className="text-xl md:text-2xl font-medium leading-tight">
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type="email"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={element.properties.placeholder}
      />
    </div>
  );
}

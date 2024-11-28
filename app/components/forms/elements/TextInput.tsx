import { FormElement, FormElementType } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Type guard to check if element is a text input
function isTextInputElement(element: FormElement): element is FormElement & {
  type: FormElementType.SHORT_TEXT | FormElementType.LONG_TEXT;
  properties: {
    placeholder: string;
    minLength?: number;
    maxLength?: number;
    richText: boolean;
  };
} {
  return (
    element.type === FormElementType.SHORT_TEXT ||
    element.type === FormElementType.LONG_TEXT
  );
}

interface TextInputProps {
  element: FormElement;
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ element, value, onChange }: TextInputProps) {
  if (!isTextInputElement(element)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label>
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={element.properties.placeholder}
        minLength={element.properties.minLength}
        maxLength={element.properties.maxLength}
      />
    </div>
  );
}

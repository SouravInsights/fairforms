import { FormElement, FormElementType } from "@/types/form";
import { Label } from "@/components/ui/label";

function isTextAreaElement(element: FormElement): element is FormElement & {
  type: FormElementType.LONG_TEXT;
  properties: {
    placeholder: string;
    minLength?: number;
    maxLength?: number;
    richText: boolean;
  };
} {
  return element.type === FormElementType.LONG_TEXT;
}

interface TextAreaProps {
  element: FormElement;
  value: string;
  onChange: (value: string) => void;
}

export function TextArea({ element, value, onChange }: TextAreaProps) {
  if (!isTextAreaElement(element)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label>
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <textarea
        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={element.properties.placeholder}
        minLength={element.properties.minLength}
        maxLength={element.properties.maxLength}
      />
      {(element.properties.minLength || element.properties.maxLength) && (
        <p className="text-sm text-muted-foreground">
          {value?.length || 0}
          {element.properties.maxLength &&
            ` / ${element.properties.maxLength}`}{" "}
          characters
        </p>
      )}
    </div>
  );
}

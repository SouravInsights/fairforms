import { FormElement, FormElementType } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function isWebsiteElement(element: FormElement): element is FormElement & {
  type: FormElementType.WEBSITE;
  properties: {
    placeholder: string;
    allowedDomains?: string[];
  };
} {
  return element.type === FormElementType.WEBSITE;
}

interface WebsiteInputProps {
  element: FormElement;
  value: string;
  onChange: (value: string) => void;
}

export function WebsiteInput({ element, value, onChange }: WebsiteInputProps) {
  if (!isWebsiteElement(element)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label className="text-xl md:text-2xl font-medium leading-tight">
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type="url"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={element.properties.placeholder}
      />
      {element.properties.allowedDomains && (
        <p className="text-sm text-muted-foreground">
          Allowed domains: {element.properties.allowedDomains.join(", ")}
        </p>
      )}
    </div>
  );
}

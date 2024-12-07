import { FormElement, FormElementType } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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

const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export function EmailInput({ element, value, onChange }: EmailInputProps) {
  const [error, setError] = useState<string | null>(null);

  // Validate email using the Gmail regex
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (!newValue.match(gmailRegex)) {
      setError("Please enter a valid Gmail address.");
    } else {
      setError(null);
    }
  };

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
        onChange={handleChange}
        placeholder={element.properties.placeholder}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

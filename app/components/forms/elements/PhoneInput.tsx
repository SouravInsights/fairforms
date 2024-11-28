import { FormElement, FormElementType } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function isPhoneElement(element: FormElement): element is FormElement & {
  type: FormElementType.PHONE;
  properties: {
    placeholder: string;
    defaultCountry: string;
    allowInternational: boolean;
  };
} {
  return element.type === FormElementType.PHONE;
}

interface PhoneInputProps {
  element: FormElement;
  value: { countryCode: string; number: string };
  onChange: (value: { countryCode: string; number: string }) => void;
}

export function PhoneInput({ element, value, onChange }: PhoneInputProps) {
  if (!isPhoneElement(element)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label>
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex gap-2">
        <Select
          value={value?.countryCode || element.properties.defaultCountry}
          onValueChange={(countryCode: string) =>
            onChange({ ...value, countryCode })
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="+1">US (+1)</SelectItem>
            <SelectItem value="+44">UK (+44)</SelectItem>
            <SelectItem value="+91">IN (+91)</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="tel"
          value={value?.number || ""}
          onChange={(e) => onChange({ ...value, number: e.target.value })}
          placeholder={element.properties.placeholder}
          className="flex-1"
        />
      </div>
    </div>
  );
}

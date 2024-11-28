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

function isAddressElement(element: FormElement): element is FormElement & {
  type: FormElementType.ADDRESS;
  properties: {
    includeCountry: boolean;
    includeApartment: boolean;
    requireZipCode: boolean;
  };
} {
  return element.type === FormElementType.ADDRESS;
}

interface AddressInputProps {
  element: FormElement;
  value: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  onChange: (value: AddressInputProps["value"]) => void;
}

export function AddressInput({ element, value, onChange }: AddressInputProps) {
  if (!isAddressElement(element)) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Label>
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="grid gap-4">
        <Input
          placeholder="Street Address"
          value={value?.street || ""}
          onChange={(e) => onChange({ ...value, street: e.target.value })}
        />
        {element.properties.includeApartment && (
          <Input
            placeholder="Apartment, suite, etc."
            value={value?.apartment || ""}
            onChange={(e) => onChange({ ...value, apartment: e.target.value })}
          />
        )}
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="City"
            value={value?.city || ""}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
          />
          <Input
            placeholder="State/Province"
            value={value?.state || ""}
            onChange={(e) => onChange({ ...value, state: e.target.value })}
          />
        </div>
        <Input
          placeholder="ZIP/Postal Code"
          value={value?.zipCode || ""}
          onChange={(e) => onChange({ ...value, zipCode: e.target.value })}
          required={element.properties.requireZipCode}
        />
        {element.properties.includeCountry && (
          <Select
            value={value?.country}
            onValueChange={(country) => onChange({ ...value, country })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IN">India</SelectItem>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}

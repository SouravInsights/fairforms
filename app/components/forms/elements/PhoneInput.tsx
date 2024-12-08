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
  value?: { countryCode: string; number: string }; // Made `value` optional
  onChange: (value: { countryCode: string; number: string }) => void;
}

export function PhoneInput({
  element,
  value = { countryCode: "", number: "" },
  onChange,
}: PhoneInputProps) {
  if (!isPhoneElement(element)) {
    return null;
  }

  const isValidNumber = value?.number.length <= 10; // Validation for max 10 digits

  // Function to sanitize input and handle validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^0-9+]/g, ""); // Allow only numbers and "+"
    onChange({ ...value, number: sanitizedValue });
  };

  return (
    <div className="space-y-2">
      <Label className="text-xl md:text-2xl font-medium leading-tight">
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex gap-2">
        {/* Country Code Select */}
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

        {/* Phone Number Input */}
        <div className="flex-1">
          <Input
            type="tel"
            value={value?.number || ""}
            onChange={handleInputChange}
            placeholder={element.properties.placeholder}
            className={`flex-1 border ${
              isValidNumber ? "border-gray-300" : "border-red-500"
            }`}
            style={{
              padding: "0.5rem",
            }}
          />
          {/* Error Message */}
          {!isValidNumber && (
            <p className="text-sm text-red-500 mt-1">
              Invalid number! Only 10 digits are allowed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

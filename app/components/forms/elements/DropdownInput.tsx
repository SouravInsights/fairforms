import { FormElement, FormElementType } from "@/types/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function isDropdownElement(element: FormElement): element is FormElement & {
  type: FormElementType.DROPDOWN;
  properties: {
    options: Array<{
      id: string;
      text: string;
    }>;
    searchable: boolean;
    placeholder: string;
  };
} {
  return element.type === FormElementType.DROPDOWN;
}

interface DropdownInputProps {
  element: FormElement;
  value: string;
  onChange: (value: string) => void;
}

export function DropdownInput({
  element,
  value,
  onChange,
}: DropdownInputProps) {
  if (!isDropdownElement(element)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label className="text-xl md:text-2xl font-medium leading-tight ">
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={element.properties.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {element.properties.options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

import { FormElement, FormElementType } from "@/types/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function isMultipleChoiceElement(
  element: FormElement
): element is FormElement & {
  type: FormElementType.MULTIPLE_CHOICE;
  properties: {
    options: Array<{
      id: string;
      text: string;
      imageUrl?: string;
    }>;
    allowMultiple: boolean;
    randomizeOrder: boolean;
    allowOther: boolean;
  };
} {
  return element.type === FormElementType.MULTIPLE_CHOICE;
}

interface MultipleChoiceInputProps {
  element: FormElement;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

export function MultipleChoiceInput({
  element,
  value,
  onChange,
}: MultipleChoiceInputProps) {
  if (!isMultipleChoiceElement(element)) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Label>
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <RadioGroup value={value as string} onValueChange={onChange}>
        {element.properties.options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id}>{option.text}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

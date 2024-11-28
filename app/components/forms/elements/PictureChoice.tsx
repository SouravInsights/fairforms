import { FormElement, FormElementType } from "@/types/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

function isPictureChoiceElement(
  element: FormElement
): element is FormElement & {
  type: FormElementType.PICTURE_CHOICE;
  properties: {
    options: Array<{
      id: string;
      imageUrl: string;
      caption: string;
    }>;
    layout: "grid" | "list";
    allowMultiple: boolean;
  };
} {
  return element.type === FormElementType.PICTURE_CHOICE;
}

interface PictureChoiceProps {
  element: FormElement;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

export function PictureChoice({
  element,
  value,
  onChange,
}: PictureChoiceProps) {
  if (!isPictureChoiceElement(element)) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Label>
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <RadioGroup
        value={value as string}
        onValueChange={onChange}
        className={cn(
          "grid gap-4",
          element.properties.layout === "grid" ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        {element.properties.options.map((option) => (
          <div
            key={option.id}
            className="relative rounded-lg border-2 border-muted p-1 hover:border-primary"
          >
            <RadioGroupItem
              value={option.id}
              id={option.id}
              className="absolute right-2 top-2"
            />
            <img
              src={option.imageUrl}
              alt={option.caption}
              className="aspect-video w-full rounded-md object-cover"
            />
            <p className="mt-2 text-center text-sm">{option.caption}</p>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

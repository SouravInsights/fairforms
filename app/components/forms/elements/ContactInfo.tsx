import { FormElement, FormElementType, FormElementValue } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ContactInfoValue = {
  firstName: string;
  lastName: string;
  middleName?: string;
};

interface ContactInfoProps {
  element: FormElement & { type: FormElementType.CONTACT_INFO };
  value: FormElementValue;
  onChange: (value: FormElementValue) => void;
}
export function ContactInfo({ element, value, onChange }: ContactInfoProps) {
  // Cast the value to the correct type
  const contactValue = (value as ContactInfoValue) || {
    firstName: "",
    lastName: "",
  };

  return (
    <div className="space-y-4">
      <Label>{element.question}</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            placeholder={element.properties.placeholders.firstName}
            value={contactValue.firstName}
            onChange={(e) =>
              onChange({
                ...contactValue,
                firstName: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Input
            placeholder={element.properties.placeholders.lastName}
            value={contactValue.lastName}
            onChange={(e) =>
              onChange({
                ...contactValue,
                lastName: e.target.value,
              })
            }
          />
        </div>
        {element.properties.showMiddleName && (
          <div className="col-span-2">
            <Input
              placeholder="Middle Name"
              value={contactValue.middleName || ""}
              onChange={(e) =>
                onChange({
                  ...contactValue,
                  middleName: e.target.value,
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

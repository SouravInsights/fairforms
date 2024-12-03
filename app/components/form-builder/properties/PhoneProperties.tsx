import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormElement, FormElementType } from "@/types/form";
import { useFormContext } from "@/app/context/form-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PhonePropertiesProps {
  element: FormElement & { type: FormElementType.PHONE };
}

export function PhoneProperties({ element }: PhonePropertiesProps) {
  const { dispatch } = useFormContext();

  const updateElementProperties = (
    updates: Partial<typeof element.properties>
  ) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        id: element.id,
        updates: {
          type: element.type,
          properties: {
            ...element.properties,
            ...updates,
          },
        },
      },
    });
  };

  return (
    <div className="space-y-6 border-t pt-4">
      <div className="space-y-2">
        <Label>Placeholder Text</Label>
        <Input
          value={element.properties.placeholder}
          onChange={(e) =>
            updateElementProperties({ placeholder: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Default Country Code</Label>
        <Select
          value={element.properties.defaultCountry}
          onValueChange={(value) =>
            updateElementProperties({ defaultCountry: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select country code" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="+1">United States (+1)</SelectItem>
            <SelectItem value="+44">United Kingdom (+44)</SelectItem>
            <SelectItem value="+91">India (+91)</SelectItem>
            <SelectItem value="+61">Australia (+61)</SelectItem>
            <SelectItem value="+86">China (+86)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={element.properties.allowInternational}
          onCheckedChange={(checked) =>
            updateElementProperties({ allowInternational: checked })
          }
        />
        <Label>Allow International Numbers</Label>
      </div>
    </div>
  );
}

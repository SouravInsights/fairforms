import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormElement, FormElementType } from "@/types/form";
import { useFormContext } from "@/app/context/form-context";

interface AddressPropertiesProps {
  element: FormElement & { type: FormElementType.ADDRESS };
}

export function AddressProperties({ element }: AddressPropertiesProps) {
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
      <div className="flex items-center space-x-2">
        <Switch
          checked={element.properties.includeCountry}
          onCheckedChange={(checked) =>
            updateElementProperties({ includeCountry: checked })
          }
        />
        <Label>Include Country Selection</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={element.properties.includeApartment}
          onCheckedChange={(checked) =>
            updateElementProperties({ includeApartment: checked })
          }
        />
        <Label>Include Apartment/Suite Field</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={element.properties.requireZipCode}
          onCheckedChange={(checked) =>
            updateElementProperties({ requireZipCode: checked })
          }
        />
        <Label>Require ZIP/Postal Code</Label>
      </div>
    </div>
  );
}

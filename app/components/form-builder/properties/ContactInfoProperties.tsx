import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormElement, FormElementType } from "@/types/form";
import { useFormContext } from "@/app/context/form-context";

interface ContactInfoPropertiesProps {
  element: FormElement & { type: FormElementType.CONTACT_INFO };
}

export function ContactInfoProperties({ element }: ContactInfoPropertiesProps) {
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
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>First Name Placeholder</Label>
          <Input
            value={element.properties.placeholders.firstName}
            onChange={(e) =>
              updateElementProperties({
                placeholders: {
                  ...element.properties.placeholders,
                  firstName: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Last Name Placeholder</Label>
          <Input
            value={element.properties.placeholders.lastName}
            onChange={(e) =>
              updateElementProperties({
                placeholders: {
                  ...element.properties.placeholders,
                  lastName: e.target.value,
                },
              })
            }
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={element.properties.showMiddleName}
          onCheckedChange={(checked) =>
            updateElementProperties({ showMiddleName: checked })
          }
        />
        <Label>Include Middle Name</Label>
      </div>
    </div>
  );
}

// src/components/form-builder/properties/EmailProperties.tsx
interface EmailPropertiesProps {
  element: FormElement & { type: FormElementType.EMAIL };
}

export function EmailProperties({ element }: EmailPropertiesProps) {
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
        <Label>Validation Pattern (optional)</Label>
        <Input
          value={element.properties.validationRegex || ""}
          onChange={(e) =>
            updateElementProperties({
              validationRegex: e.target.value || undefined,
            })
          }
          placeholder="Regular expression for custom validation"
        />
      </div>
    </div>
  );
}

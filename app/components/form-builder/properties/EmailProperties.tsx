import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormElement, FormElementType } from "@/types/form";
import { useFormContext } from "@/app/context/form-context";

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
          placeholder="e.g., Enter your email address"
        />
      </div>

      <div className="space-y-2">
        <Label>Custom Validation Pattern (Optional)</Label>
        <Input
          value={element.properties.validationRegex || ""}
          onChange={(e) =>
            updateElementProperties({
              validationRegex: e.target.value || undefined,
            })
          }
          placeholder="Regular expression for custom validation"
        />
        <p className="text-xs text-muted-foreground">
          Leave empty to use standard email validation
        </p>
      </div>
    </div>
  );
}

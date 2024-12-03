import { useFormContext } from "@/app/context/form-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormElement, FormElementType } from "@/types/form";

interface WelcomeScreenPropertiesProps {
  element: FormElement & { type: FormElementType.WELCOME_SCREEN };
}

export function WelcomeScreenProperties({
  element,
}: WelcomeScreenPropertiesProps) {
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
        <Label>Title</Label>
        <Input
          value={element.properties.title}
          onChange={(e) => updateElementProperties({ title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Subtitle (Optional)</Label>
        <Input
          value={element.properties.subtitle || ""}
          onChange={(e) =>
            updateElementProperties({
              subtitle: e.target.value || undefined,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Button Text</Label>
        <Input
          value={element.properties.buttonText}
          onChange={(e) =>
            updateElementProperties({ buttonText: e.target.value })
          }
        />
      </div>
    </div>
  );
}

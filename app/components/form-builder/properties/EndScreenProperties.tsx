import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormElement, FormElementType } from "@/types/form";
import { useFormContext } from "@/app/context/form-context";

interface EndScreenPropertiesProps {
  element: FormElement & { type: FormElementType.END_SCREEN };
}

export function EndScreenProperties({ element }: EndScreenPropertiesProps) {
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
        <Label>Message</Label>
        <Input
          value={element.properties.message}
          onChange={(e) => updateElementProperties({ message: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Button Text (Optional)</Label>
        <Input
          value={element.properties.buttonText || ""}
          onChange={(e) =>
            updateElementProperties({
              buttonText: e.target.value || undefined,
            })
          }
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={element.properties.showSocialShare}
          onCheckedChange={(checked) =>
            updateElementProperties({ showSocialShare: checked })
          }
        />
        <Label>Show Social Share Buttons</Label>
      </div>
    </div>
  );
}

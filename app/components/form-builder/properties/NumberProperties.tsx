import { useFormContext } from "@/app/context/form-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormElement, FormElementType } from "@/types/form";

interface NumberPropertiesProps {
  element: FormElement & { type: FormElementType.NUMBER };
}

export function NumberProperties({ element }: NumberPropertiesProps) {
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Minimum Value</Label>
          <Input
            type="number"
            value={element.properties.min ?? ""}
            onChange={(e) =>
              updateElementProperties({
                min: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Maximum Value</Label>
          <Input
            type="number"
            value={element.properties.max ?? ""}
            onChange={(e) =>
              updateElementProperties({
                max: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Step</Label>
        <Input
          type="number"
          value={element.properties.step ?? ""}
          min="0"
          step="any"
          onChange={(e) =>
            updateElementProperties({
              step: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Prefix</Label>
        <Input
          value={element.properties.prefix ?? ""}
          onChange={(e) =>
            updateElementProperties({
              prefix: e.target.value || undefined,
            })
          }
          placeholder="e.g., $"
        />
      </div>

      <div className="space-y-2">
        <Label>Suffix</Label>
        <Input
          value={element.properties.suffix ?? ""}
          onChange={(e) =>
            updateElementProperties({
              suffix: e.target.value || undefined,
            })
          }
          placeholder="e.g., kg"
        />
      </div>
    </div>
  );
}

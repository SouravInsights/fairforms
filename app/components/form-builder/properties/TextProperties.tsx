import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormElement, FormElementType } from "@/types/form";
import { useFormContext } from "@/app/context/form-context";
import { Textarea } from "@/components/ui/textarea";
import { useCallback } from "react";

interface TextPropertiesProps {
  element: FormElement & {
    type: FormElementType.LONG_TEXT | FormElementType.SHORT_TEXT;
  };
}

export function TextProperties({ element }: TextPropertiesProps) {
  const { dispatch } = useFormContext();

  const updateElement = useCallback(
    (updates: Partial<Omit<FormElement, "type" | "properties">>) => {
      dispatch({
        type: "UPDATE_ELEMENT",
        payload: {
          id: element.id,
          updates,
        },
      });
    },
    [dispatch, element.id]
  );

  const updateElementProperties = useCallback(
    (updates: Partial<typeof element.properties>) => {
      dispatch({
        type: "UPDATE_ELEMENT",
        payload: {
          id: element.id,
          updates: {
            properties: {
              ...element.properties,
              ...updates,
            },
          },
        },
      });
    },
    [dispatch, element]
  );

  return (
    <div className="space-y-6 border-t pt-4">
      <div className="space-y-2">
        <Label>Description (optional)</Label>
        <Textarea
          value={element.description || ""}
          onChange={(e) => updateElement({ description: e.target.value })}
          placeholder="Add a description to provide more context"
          className="resize-none"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Placeholder Text</Label>
        <Input
          value={element.properties.placeholder}
          onChange={(e) =>
            updateElementProperties({ placeholder: e.target.value })
          }
        />
      </div>

      {element.type === FormElementType.LONG_TEXT && (
        <div className="flex items-center space-x-2">
          <Switch
            checked={element.properties.richText}
            onCheckedChange={(checked) =>
              updateElementProperties({ richText: checked })
            }
          />
          <Label>Enable Rich Text</Label>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Minimum Length</Label>
          <Input
            type="number"
            min={0}
            value={element.properties.minLength || ""}
            onChange={(e) =>
              updateElementProperties({
                minLength: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Maximum Length</Label>
          <Input
            type="number"
            min={0}
            value={element.properties.maxLength || ""}
            onChange={(e) =>
              updateElementProperties({
                maxLength: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

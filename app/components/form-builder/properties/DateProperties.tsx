import { useFormContext } from "@/app/context/form-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormElement, FormElementType } from "@/types/form";

interface DatePropertiesProps {
  element: FormElement & { type: FormElementType.DATE };
}

export function DateProperties({ element }: DatePropertiesProps) {
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
        <Label>Date Format</Label>
        <Select
          value={element.properties.format}
          onValueChange={(value) => updateElementProperties({ format: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
            <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
            <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Minimum Date</Label>
          <Input
            type="date"
            value={element.properties.minDate || ""}
            onChange={(e) =>
              updateElementProperties({ minDate: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Maximum Date</Label>
          <Input
            type="date"
            value={element.properties.maxDate || ""}
            onChange={(e) =>
              updateElementProperties({ maxDate: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={element.properties.includeTime}
          onCheckedChange={(checked) =>
            updateElementProperties({ includeTime: checked })
          }
        />
        <Label>Include Time</Label>
      </div>
    </div>
  );
}

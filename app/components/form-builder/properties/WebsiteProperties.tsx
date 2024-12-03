import { Label } from "@/components/ui/label";
import { FormElement, FormElementType } from "@/types/form";
import { useFormContext } from "@/app/context/form-context";
import { Input } from "@/components/ui/input";

interface WebsitePropertiesProps {
  element: FormElement & { type: FormElementType.WEBSITE };
}

export function WebsiteProperties({ element }: WebsitePropertiesProps) {
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
        <Label>Allowed Domains (Optional)</Label>
        <Input
          value={element.properties.allowedDomains?.join(", ") || ""}
          onChange={(e) => {
            const domains = e.target.value
              .split(",")
              .map((d) => d.trim())
              .filter(Boolean);
            updateElementProperties({
              allowedDomains: domains.length > 0 ? domains : undefined,
            });
          }}
          placeholder="e.g., example.com, sample.org"
        />
        <p className="text-sm text-muted-foreground">
          Comma-separated list of allowed domains
        </p>
      </div>
    </div>
  );
}

import { useFormContext } from "@/app/context/form-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormElement, FormElementType } from "@/types/form";

interface FileUploadPropertiesProps {
  element: FormElement & { type: FormElementType.FILE_UPLOAD };
}

export function FileUploadProperties({ element }: FileUploadPropertiesProps) {
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
        <Label>Maximum File Size (MB)</Label>
        <Input
          type="number"
          min="1"
          value={element.properties.maxSize / (1024 * 1024)}
          onChange={(e) =>
            updateElementProperties({
              maxSize: Number(e.target.value) * 1024 * 1024,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Maximum Number of Files</Label>
        <Input
          type="number"
          min="1"
          value={element.properties.maxFiles}
          onChange={(e) =>
            updateElementProperties({ maxFiles: Number(e.target.value) })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Allowed File Types</Label>
        <Input
          value={element.properties.allowedTypes.join(", ")}
          onChange={(e) => {
            const types = e.target.value
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            updateElementProperties({ allowedTypes: types });
          }}
          placeholder="e.g., image/*, .pdf, .doc"
        />
        <p className="text-sm text-muted-foreground">
          Comma-separated list of MIME types or file extensions
        </p>
      </div>
    </div>
  );
}

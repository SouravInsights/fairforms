import { useFormContext } from "@/app/context/form-context";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormElement, FormElementType } from "@/types/form";
import { MultipleChoiceProperties } from "./properties/MultipleChoiceProperties";

export function Properties({ className }: { className?: string }) {
  const { state, dispatch } = useFormContext();
  const activeElement = state.elements.find(
    (el) => el.id === state.activeElementId
  );

  if (!activeElement) return null;

  const updateElement = (updates: Partial<FormElement>) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        id: activeElement.id,
        updates: {
          ...updates,
          type: activeElement.type, // Ensure type stays the same
        } as FormElement,
      },
    });
  };

  const renderElementSpecificProperties = () => {
    switch (activeElement.type) {
      case FormElementType.MULTIPLE_CHOICE:
        return <MultipleChoiceProperties element={activeElement} />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("p-4 space-y-4", className)}>
      <div className="space-y-2">
        <Label>Question</Label>
        <Input
          value={activeElement.question}
          onChange={(e) => updateElement({ question: e.target.value })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={activeElement.required}
          onCheckedChange={(checked) => updateElement({ required: checked })}
        />
        <Label>Required</Label>
      </div>
      {renderElementSpecificProperties()}
    </div>
  );
}

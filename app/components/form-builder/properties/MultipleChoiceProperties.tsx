/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormElement, FormElementType } from "@/types/form";
import { useFormContext } from "@/app/context/form-context";
import { Grip, Plus, Trash2 } from "lucide-react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";

interface MultipleChoicePropertiesProps {
  element: FormElement & { type: FormElementType.MULTIPLE_CHOICE };
}

export function MultipleChoiceProperties({
  element,
}: MultipleChoicePropertiesProps) {
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

  const addOption = () => {
    const newOption = {
      id: `option-${Date.now()}`,
      text: `Option ${element.properties.options.length + 1}`,
    };

    updateElementProperties({
      options: [...element.properties.options, newOption],
    });
  };

  const removeOption = (optionId: string) => {
    updateElementProperties({
      options: element.properties.options.filter((opt) => opt.id !== optionId),
    });
  };

  const updateOptionText = (optionId: string, text: string) => {
    updateElementProperties({
      options: element.properties.options.map((opt) =>
        opt.id === optionId ? { ...opt, text } : opt
      ),
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const options = Array.from(element.properties.options);
    const [removed] = options.splice(result.source.index, 1);
    options.splice(result.destination.index, 0, removed);

    updateElementProperties({ options });
  };

  return (
    <div className="space-y-6 border-t pt-4">
      <div className="space-y-2">
        <Label>Description (optional)</Label>
        <Textarea
          value={element.description || ""}
          onChange={(e) => updateElement({ description: e.target.value })}
          placeholder="Add description to provide additional context"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Options</Label>
          <Button onClick={addOption} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Option
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="options">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {element.properties.options.map((option, index) => (
                  <Draggable
                    key={option.id}
                    draggableId={option.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center space-x-2"
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="p-2 hover:bg-muted rounded-md"
                        >
                          <Grip className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          value={option.text}
                          onChange={(e) =>
                            updateOptionText(option.id, e.target.value)
                          }
                          className="flex-1"
                        />
                        <Button
                          onClick={() => removeOption(option.id)}
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={element.properties.allowMultiple}
            onCheckedChange={(checked) =>
              updateElementProperties({ allowMultiple: checked })
            }
          />
          <Label>Allow Multiple Selections</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={element.properties.randomizeOrder}
            onCheckedChange={(checked) =>
              updateElementProperties({ randomizeOrder: checked })
            }
          />
          <Label>Randomize Order</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={element.properties.allowOther}
            onCheckedChange={(checked) =>
              updateElementProperties({ allowOther: checked })
            }
          />
          <Label>Allow "Other" Option</Label>
        </div>
      </div>
    </div>
  );
}

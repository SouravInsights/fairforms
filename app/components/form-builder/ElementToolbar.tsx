import { Droppable, Draggable } from "@hello-pangea/dnd";
import { useFormContext } from "@/app/context/form-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormElement } from "@/types/form";
import { Separator } from "@/components/ui/separator";
import { nanoid } from "nanoid";
import { ELEMENT_GROUPS, isSpecialElement } from "./ElementConfig";
import { getDefaultProperties } from "./form-utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ElementToolbar({ className }: { className?: string }) {
  const { dispatch } = useFormContext();

  const createNewElement = (type: FormElement["type"]) => {
    const id = nanoid();
    const properties = getDefaultProperties(type);

    const baseElement = {
      id,
      type,
      required: false,
      order: Date.now(),
      // Only add question for non-special elements
      ...(isSpecialElement(type) ? {} : { question: `New ${type} question` }),
    };

    dispatch({
      type: "ADD_ELEMENT",
      payload: { ...baseElement, properties } as FormElement,
    });
  };

  return (
    <ScrollArea className={className}>
      <div className="p-4 space-y-6">
        {Object.entries(ELEMENT_GROUPS).map(([group, elements]) => (
          <div key={group}>
            <h3 className="text-sm font-semibold mb-2">{group}</h3>
            <Droppable droppableId={`toolbar-${group}`} isDropDisabled={true}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  {elements.map(({ type, icon: Icon, label }, index) => (
                    <Draggable
                      key={type}
                      draggableId={`toolbar-${type}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Button
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start",
                            snapshot.isDragging && "ring-2 ring-primary"
                          )}
                          onClick={() => createNewElement(type)}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {label}
                        </Button>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

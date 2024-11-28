import { Droppable, Draggable } from "@hello-pangea/dnd";
import { useFormContext } from "@/app/context/form-context";
import { cn } from "@/lib/utils";
// import { FormElement } from '@/types/form';
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripVertical } from "lucide-react";

export function Canvas({ className }: { className?: string }) {
  const { state, dispatch } = useFormContext();

  const handleElementClick = (elementId: string) => {
    dispatch({ type: "SET_ACTIVE_ELEMENT", payload: elementId });
  };

  return (
    <ScrollArea className={className}>
      <Droppable droppableId="FORM_CANVAS">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "p-6 min-h-screen",
              snapshot.isDraggingOver && "bg-muted/50"
            )}
          >
            {state.elements.map((element, index) => (
              <Draggable
                key={element.id}
                draggableId={element.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      "group relative p-4 mb-4 border rounded-lg bg-background",
                      snapshot.isDragging && "ring-2 ring-primary",
                      state.activeElementId === element.id && "border-primary",
                      "hover:border-primary/50 transition-colors"
                    )}
                    onClick={() => handleElementClick(element.id)}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="pl-8">
                      <div className="font-medium text-sm text-muted-foreground mb-1">
                        {element.type}
                      </div>
                      <div>{element.question}</div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </ScrollArea>
  );
}

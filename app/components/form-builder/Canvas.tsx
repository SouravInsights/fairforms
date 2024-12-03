import { Droppable, Draggable } from "@hello-pangea/dnd";
import { useFormContext } from "@/app/context/form-context";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormElementType } from "@/types/form";

export function Canvas({ className }: { className?: string }) {
  const { state, dispatch } = useFormContext();

  const handleElementClick = (elementId: string) => {
    dispatch({ type: "SET_ACTIVE_ELEMENT", payload: elementId });
  };

  const handleDelete = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering element click
    dispatch({ type: "DELETE_ELEMENT", payload: elementId });
  };

  // Function to render the element content based on type
  const renderElementContent = (element: (typeof state.elements)[0]) => {
    // Special handling for Welcome and End screens
    if (
      element.type === FormElementType.WELCOME_SCREEN ||
      element.type === FormElementType.END_SCREEN
    ) {
      return (
        <div>
          <div className="font-medium">{element.properties.title}</div>
          <div className="text-muted-foreground text-sm">
            {element.type === FormElementType.WELCOME_SCREEN
              ? element.properties.subtitle
              : element.properties.message}
          </div>
        </div>
      );
    }

    // For Statement type
    if (element.type === FormElementType.STATEMENT) {
      return (
        <div>
          <div className="font-medium">{element.properties.statement}</div>
        </div>
      );
    }

    // Default display for other element types
    return (
      <>
        <div className="font-medium text-sm text-muted-foreground mb-1">
          {element.type}
        </div>
        <div>{element.question}</div>
      </>
    );
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
                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                      onClick={(e) => handleDelete(element.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    {/* Drag Handle */}
                    <div
                      {...provided.dragHandleProps}
                      className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Element Content */}
                    <div className="pl-8 pr-8">
                      {renderElementContent(element)}
                      {element.required && (
                        <div className="text-destructive text-sm mt-1">
                          * Required
                        </div>
                      )}
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

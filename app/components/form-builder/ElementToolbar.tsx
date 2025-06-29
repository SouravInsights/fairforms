import { Droppable, Draggable } from "@hello-pangea/dnd";
import { useFormContext } from "@/app/context/form-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormElement } from "@/types/form";
import { nanoid } from "nanoid";
import { ELEMENT_GROUPS, isSpecialElement } from "./ElementConfig";
import { getDefaultProperties } from "./form-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDefaultQuestion } from "./default-questions";

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
      ...(isSpecialElement(type) ? {} : { question: getDefaultQuestion(type) }),
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
          <div key={group} className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide">
              {group}
            </h3>

            <Droppable droppableId={`toolbar-${group}`} isDropDisabled={true}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-2 gap-2"
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
                            "h-auto min-h-[85px] flex flex-col items-center justify-center gap-3 p-3 rounded-md border transition-all duration-200 group relative overflow-hidden",
                            "bg-card border-border shadow-sm hover:shadow-md",
                            "hover:scale-[1.02] hover:-translate-y-0.5 hover:bg-accent",
                            snapshot.isDragging &&
                              "ring-2 ring-ring ring-offset-2 shadow-lg scale-105 bg-accent"
                          )}
                          onClick={() => createNewElement(type)}
                        >
                          {/* Subtle overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                          {/* Icon with background circle */}
                          <div
                            className={cn(
                              "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
                              "bg-primary/10 group-hover:bg-primary/15 group-hover:scale-110"
                            )}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0 text-primary transition-all duration-200 group-hover:text-primary/80" />
                          </div>

                          <span className="text-xs font-medium text-muted-foreground text-center leading-tight px-1 relative z-10 group-hover:text-foreground transition-colors duration-200">
                            {label}
                          </span>
                        </Button>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

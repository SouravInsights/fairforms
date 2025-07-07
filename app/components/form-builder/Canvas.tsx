import { Droppable, Draggable } from "@hello-pangea/dnd";
import { useFormContext } from "@/app/context/form-context";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormElementType, FormElement } from "@/types/form";
import { useState, useRef, useEffect } from "react";

export function Canvas({ className }: { className?: string }) {
  const { state, dispatch } = useFormContext();
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<
    "title" | "subtitle" | "default"
  >("default");
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleElementClick = (elementId: string) => {
    dispatch({ type: "SET_ACTIVE_ELEMENT", payload: elementId });
  };

  const handleDelete = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch({ type: "DELETE_ELEMENT", payload: elementId });
  };

  const startEditing = (
    elementId: string,
    currentValue: string,
    field: "title" | "subtitle" | "default" = "default",
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setEditingElement(elementId);
    setEditingField(field);
    setEditValue(currentValue);
  };

  const updateElement = (elementId: string, updates: Partial<FormElement>) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        id: elementId,
        updates,
      },
    });
  };

  const saveEdit = () => {
    if (editingElement) {
      const element = state.elements.find((el) => el.id === editingElement);
      if (element) {
        if (element.type === FormElementType.WELCOME_SCREEN) {
          if (editingField === "title") {
            updateElement(editingElement, {
              properties: {
                ...element.properties,
                title: editValue,
              },
            });
          } else if (editingField === "subtitle") {
            updateElement(editingElement, {
              properties: {
                ...element.properties,
                subtitle: editValue,
              },
            });
          }
        } else if (element.type === FormElementType.END_SCREEN) {
          updateElement(editingElement, {
            properties: { ...element.properties, title: editValue },
          });
        } else if (element.type === FormElementType.STATEMENT) {
          updateElement(editingElement, {
            properties: { ...element.properties, statement: editValue },
          });
        } else {
          updateElement(editingElement, { question: editValue });
        }
      }
    }
    setEditingElement(null);
    setEditingField("default");
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingElement(null);
    setEditingField("default");
    setEditValue("");
  };

  // Auto-focus input when editing starts
  useEffect(() => {
    if (editingElement && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingElement]);

  // Handle keyboard events for editing
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  // Function to get the editable text from an element
  const getEditableText = (
    element: FormElement,
    field: "title" | "subtitle" | "default" = "default"
  ) => {
    if (element.type === FormElementType.WELCOME_SCREEN) {
      if (field === "title") {
        return element.properties.title || "";
      } else if (field === "subtitle") {
        return element.properties.subtitle || "";
      }
      return element.properties.title || "";
    } else if (element.type === FormElementType.END_SCREEN) {
      return element.properties.title || "";
    } else if (element.type === FormElementType.STATEMENT) {
      return element.properties.statement || "";
    }
    return element.question || "";
  };

  // Function to render the element content based on type
  const renderElementContent = (element: FormElement) => {
    const isTitleEditing =
      editingElement === element.id && editingField === "title";
    const isSubtitleEditing =
      editingElement === element.id && editingField === "subtitle";

    // Special handling for Welcome and End screens
    if (
      element.type === FormElementType.WELCOME_SCREEN ||
      element.type === FormElementType.END_SCREEN
    ) {
      return (
        <div className="space-y-2">
          {/* Title Section */}
          <div className="flex items-center gap-2">
            {isTitleEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={handleKeyDown}
                className="flex-1 text-lg font-semibold bg-transparent border-none outline-none focus:bg-muted/50 rounded px-2 py-1"
              />
            ) : (
              <div
                className="flex-1 text-lg font-semibold cursor-text hover:bg-muted/50 rounded px-2 py-1 transition-colors"
                onClick={(e) =>
                  startEditing(
                    element.id,
                    getEditableText(element, "title"),
                    "title",
                    e
                  )
                }
              >
                {element.properties.title || "Click to edit title"}
              </div>
            )}
          </div>

          {/* Subtitle Section (only for Welcome Screen) */}
          {element.type === FormElementType.WELCOME_SCREEN && (
            <div className="flex items-center gap-2">
              {isSubtitleEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={handleKeyDown}
                  className="flex-1 text-muted-foreground bg-transparent border-none outline-none focus:bg-muted/50 rounded px-2 py-1"
                />
              ) : (
                <div
                  className="flex-1 text-muted-foreground cursor-text hover:bg-muted/50 rounded px-2 py-1 transition-colors"
                  onClick={(e) =>
                    startEditing(
                      element.id,
                      getEditableText(element, "subtitle"),
                      "subtitle",
                      e
                    )
                  }
                >
                  {element.properties.subtitle || "Click to edit subtitle"}
                </div>
              )}
            </div>
          )}

          {/* Message for End Screen */}
          {element.type === FormElementType.END_SCREEN && (
            <div className="text-muted-foreground">
              {element.properties.message}
            </div>
          )}
        </div>
      );
    }

    // For Statement type
    if (element.type === FormElementType.STATEMENT) {
      const isEditing = editingElement === element.id;
      const editableText = getEditableText(element);

      return (
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={handleKeyDown}
              className="flex-1 font-medium bg-transparent border-none outline-none focus:bg-muted/50 rounded px-2 py-1"
            />
          ) : (
            <div
              className="flex-1 font-medium cursor-text hover:bg-muted/50 rounded px-2 py-1 transition-colors"
              onClick={(e) =>
                startEditing(element.id, editableText, "default", e)
              }
            >
              {element.properties.statement || "Click to edit statement"}
            </div>
          )}
        </div>
      );
    }

    // Default display for other element types
    const isEditing = editingElement === element.id;
    const editableText = getEditableText(element);

    return (
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {element.type.replace(/_/g, " ")}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={handleKeyDown}
              className="flex-1 font-medium bg-transparent border-none outline-none focus:bg-muted/50 rounded px-2 py-1"
            />
          ) : (
            <div
              className="flex-1 font-medium cursor-text hover:bg-muted/50 rounded px-2 py-1 transition-colors"
              onClick={(e) =>
                startEditing(element.id, editableText, "default", e)
              }
            >
              {element.question || "Click to edit question"}
            </div>
          )}
        </div>
        {element.description && (
          <div className="text-sm text-muted-foreground pl-2">
            {element.description}
          </div>
        )}
      </div>
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
              snapshot.isDraggingOver && "bg-muted/30"
            )}
          >
            {state.elements.length === 0 && (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center">
                  <div className="text-muted-foreground text-lg font-medium mb-2">
                    Start building your form
                  </div>
                  <div className="text-muted-foreground/75 text-sm">
                    Drag elements from the sidebar to add them to your form
                  </div>
                </div>
              </div>
            )}

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
                      "group relative p-4 mb-4 border rounded-md bg-card shadow-sm",
                      snapshot.isDragging && "ring-2 ring-ring shadow-lg",
                      state.activeElementId === element.id &&
                        "border-primary ring-1 ring-primary/20",
                      "hover:border-primary/50 hover:shadow-md transition-all duration-200"
                    )}
                    onClick={() => handleElementClick(element.id)}
                  >
                    {/* Action Buttons */}
                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) => handleDelete(element.id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Drag Handle */}
                    <div
                      {...provided.dragHandleProps}
                      className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Element Content */}
                    <div className="pl-8 pr-12">
                      {renderElementContent(element)}
                      {element.required && (
                        <div className="text-destructive text-xs mt-2 font-medium">
                          * Required field
                        </div>
                      )}
                    </div>

                    {/* Active Element Indicator */}
                    {state.activeElementId === element.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-sm" />
                    )}
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

import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useFormContext } from "@/app/context/form-context";
import { ElementToolbar } from "./ElementToolbar";
import { Canvas } from "./Canvas";
import { Properties } from "./Properties";
import { FormElement, FormElementType } from "@/types/form";
import { useToast } from "@/hooks/use-toast";
import { Globe, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDefaultProperties } from "./form-utils";
import { FormPreview } from "./FormPreview";
import { useUser } from "@clerk/nextjs";

export function FormBuilder({ formId }: { formId: string }) {
  const { state, dispatch } = useFormContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    const loadForm = async () => {
      try {
        setIsLoading(true);

        if (formId === "new") {
          // Create a new form
          const response = await fetch("/api/forms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const newForm = await response.json();
          if (response.ok) {
            dispatch({
              type: "SET_INITIAL_STATE",
              payload: { elements: newForm.elements },
            });
            setIsPublished(newForm.isPublished);
            // Redirect to the new form's edit page
            window.history.replaceState(
              {},
              "",
              `/dashboard/forms/${newForm.id}`
            );
          } else {
            throw new Error("Failed to create new form");
          }
        } else {
          // Load existing form
          const response = await fetch(`/api/forms/${formId}`);
          const form = await response.json();

          if (response.ok) {
            dispatch({
              type: "SET_INITIAL_STATE",
              payload: { elements: form.elements },
            });
            setIsPublished(form.isPublished);
          } else {
            throw new Error("Failed to load form");
          }
        }
      } catch (error) {
        console.error("Error loading form:", error);
        toast({
          title: "Error",
          description: "Failed to load form. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadForm();
  }, [formId, dispatch, toast]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // Handle dragging from toolbar to canvas
    if (source.droppableId === "ELEMENT_TOOLBAR") {
      const elementType = draggableId as FormElementType;
      const defaultProperties = getDefaultProperties(elementType);

      const newElement = {
        id: `${elementType}-${Date.now()}`,
        type: elementType,
        question: `New ${elementType} question`,
        required: false,
        order: destination.index,
        properties: defaultProperties,
      } as FormElement;

      dispatch({
        type: "ADD_ELEMENT",
        payload: newElement,
      });

      // Save the updated form
      try {
        await fetch(`/api/forms/${formId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            elements: [...state.elements, newElement],
          }),
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to save changes. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    // Handle reordering within canvas
    if (source.droppableId === "FORM_CANVAS") {
      const newElements = Array.from(state.elements);
      const [removed] = newElements.splice(source.index, 1);
      newElements.splice(destination.index, 0, removed);

      const reorderedElements = newElements.map((element, index) => ({
        ...element,
        order: index,
      }));

      dispatch({
        type: "REORDER_ELEMENTS",
        payload: reorderedElements,
      });

      // Save the updated form
      try {
        await fetch(`/api/forms/${formId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            elements: reorderedElements,
          }),
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to save changes. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const togglePublish = async () => {
    // Only allow publishing if we have a real form ID (not 'new')
    if (formId === "new") {
      toast({
        title: "Error",
        description: "Please save the form first before publishing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/forms/${formId}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle publish status");
      }

      const updatedForm = await response.json();
      setIsPublished(updatedForm.isPublished);

      toast({
        title: updatedForm.isPublished ? "Form Published" : "Form Unpublished",
        description: updatedForm.isPublished
          ? "Your form is now publicly accessible"
          : "Your form is now private",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update form status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-background">
        <div className="border-b">
          <div className="container flex items-center justify-between py-4">
            <h1 className="text-xl font-semibold">Form Builder</h1>
            <div className="flex items-center gap-2">
              {user && (
                <FormPreview
                  elements={state.elements}
                  formId={formId}
                  userId={user.id}
                  title={state.title}
                  description={state.description}
                  settings={state.settings}
                />
              )}
              {formId !== "new" && (
                <Button
                  onClick={togglePublish}
                  variant={isPublished ? "outline" : "default"}
                >
                  {isPublished ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      Publish
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <ElementToolbar className="w-64 border-r" />
          <Canvas className="flex-1" />
          {state.activeElementId && <Properties className="w-80 border-l" />}
        </div>
      </div>
    </DragDropContext>
  );
}

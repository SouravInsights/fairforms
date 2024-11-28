import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useFormContext } from "@/app/context/form-context";
import { ElementToolbar } from "./ElementToolbar";
import { Canvas } from "./Canvas";
import { Properties } from "./Properties";
import { FormElement, FormElementType } from "@/types/form";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export function FormBuilder({ formId }: { formId: string }) {
  const { state, dispatch } = useFormContext();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadForm = async () => {
      try {
        setIsLoading(true);

        if (formId === "new") {
          // Create a new form
          const response = await axios.post("/api/forms");
          const newForm = response.data;

          dispatch({
            type: "SET_INITIAL_STATE",
            payload: { elements: newForm.elements },
          });
        } else {
          // Load existing form
          const response = await axios.get(`/api/forms/${formId}`);
          const form = response.data;

          if (form) {
            dispatch({
              type: "SET_INITIAL_STATE",
              payload: { elements: form.elements },
            });
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
        await axios.patch(`/api/forms/${formId}`, {
          elements: [...state.elements, newElement],
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
        await axios.patch(`/api/forms/${formId}`, {
          elements: reorderedElements,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-background">
        <ElementToolbar className="w-64 border-r" />
        <Canvas className="flex-1" />
        {state.activeElementId && <Properties className="w-80 border-l" />}
      </div>
    </DragDropContext>
  );
}

// Helper function to get default properties based on element type
function getDefaultProperties(type: FormElementType) {
  switch (type) {
    case FormElementType.CONTACT_INFO:
      return {
        placeholders: { firstName: "First Name", lastName: "Last Name" },
        showMiddleName: false,
      };
    case FormElementType.EMAIL:
      return {
        placeholder: "Enter your email",
        validationRegex: undefined,
      };
    // Add cases for all other element types
    default:
      return {};
  }
}

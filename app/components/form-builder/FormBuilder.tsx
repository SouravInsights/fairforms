import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useFormContext } from "@/app/context/form-context";
import { ElementToolbar } from "./ElementToolbar";
import { Canvas } from "./Canvas";
import { Properties } from "./Properties";
import {
  Form,
  FormElement,
  FormElementType,
  UpdateFormData,
} from "@/types/form";
import { useToast } from "@/hooks/use-toast";
import { Globe, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDefaultProperties } from "./form-utils";
import { FormPreview } from "./FormPreview";
import { useUser } from "@clerk/nextjs";
import { ShareDialog } from "../forms/ShareDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";
import { EditFormDialog } from "./EditFormDialog";
import { ManageCollaboratorsDialog } from "./ManageCollaboratorsDialog";

export function FormBuilder({ formId }: { formId: string }) {
  const { state, dispatch } = useFormContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [formData, setFormData] = useState<Form | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  const loadFormData = async () => {
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
            payload: {
              elements: newForm.elements,
              title: newForm.title,
              description: newForm.description,
              settings: newForm.settings,
            },
          });
          setIsPublished(newForm.isPublished);
          setFormData(newForm);
          // Redirect to the new form's edit page
          window.history.replaceState({}, "", `/dashboard/forms/${newForm.id}`);
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
            payload: {
              elements: form.elements,
              title: form.title,
              description: form.description,
              settings: form.settings,
            },
          });
          setIsPublished(form.isPublished);
          setFormData(form);
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

  useEffect(() => {
    loadFormData();
  }, [formId]);

  const saveFormChanges = async (formData: Partial<UpdateFormData>) => {
    if (formId === "new") return;

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      const updatedData = await response.json();
      return updatedData;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

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

      const updatedElements = [...state.elements, newElement];

      dispatch({
        type: "ADD_ELEMENT",
        payload: newElement,
      });

      await saveFormChanges({ elements: updatedElements });
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

      await saveFormChanges({ elements: reorderedElements });
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
    // prevent publishing if there are no form elements
    if (state.elements.length === 0 && !isPublished) {
      toast({
        title: "Error",
        description:
          "Cannot publish a form with no elements. Please add at least one form element.",
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
        // Include current state in the request
        body: JSON.stringify({
          elements: state.elements,
          title: state.title,
          description: state.description,
          settings: state.settings,
        }),
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

  const handleFormUpdate = async (updates: Partial<Form>): Promise<void> => {
    try {
      // Make the API call
      const updatedForm = await saveFormChanges(updates);
      console.log("Form updated successfully:", updatedForm);

      // Update local state
      setFormData((prev) => {
        if (!prev) return updatedForm;
        return { ...prev, ...updatedForm };
      });

      // Update form context if needed
      if (updates.title !== undefined) {
        dispatch({
          type: "UPDATE_FORM_DETAILS",
          payload: { title: updates.title },
        });
      }
      if (updates.description !== undefined) {
        dispatch({
          type: "UPDATE_FORM_DETAILS",
          payload: { description: updates.description },
        });
      }

      // For slug updates, make sure to refresh form data
      if (updates.customSlug !== undefined) {
        // Short delay to ensure the database has updated
        setTimeout(() => {
          loadFormData();
        }, 500);
      }

      return Promise.resolve();
    } catch (error) {
      console.error("Error in handleFormUpdate:", error);
      toast({
        title: "Error",
        description: "Failed to update form settings",
        variant: "destructive",
      });
      return Promise.reject(error);
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
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Home className="h-4 w-4" />
                  <BreadcrumbLink href="/dashboard">My Forms</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <EditFormDialog
                    title={state.title}
                    description={state.description}
                    onSave={(updates) => {
                      dispatch({
                        type: "UPDATE_FORM_DETAILS",
                        payload: updates,
                      });
                      saveFormChanges(updates);
                    }}
                  />
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
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
              {formId !== "new" && formData && (
                <>
                  <ShareDialog
                    form={{
                      id: parseInt(formId),
                      title: state.title,
                      description: state.description,
                      elements: state.elements,
                      settings: state.settings,
                      isPublished,
                      userId: user?.id || "",
                      createdAt: formData.createdAt,
                      updatedAt: formData.updatedAt,
                      customSlug: formData.customSlug,
                      metaTitle: formData.metaTitle || state.title,
                      metaDescription:
                        formData.metaDescription || state.description,
                      socialImageUrl: formData.socialImageUrl,
                    }}
                    onUpdate={handleFormUpdate}
                  />
                  <ManageCollaboratorsDialog
                    form={{
                      id: parseInt(formId),
                      title: state.title,
                      description: state.description,
                      elements: state.elements,
                      settings: state.settings,
                      isPublished,
                      userId: user?.id || "",
                      createdAt: formData.createdAt,
                      updatedAt: formData.updatedAt,
                      customSlug: formData.customSlug,
                      metaTitle: formData.metaTitle || state.title,
                      metaDescription:
                        formData.metaDescription || state.description,
                      socialImageUrl: formData.socialImageUrl,
                    }}
                  />
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
                </>
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

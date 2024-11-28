import { Droppable, Draggable } from "@hello-pangea/dnd";
import { useFormContext } from "@/app/context/form-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormElement, FormElementType } from "@/types/form";
import { Separator } from "@/components/ui/separator";
import { nanoid } from "nanoid";

const ELEMENT_GROUPS = {
  "Contact Info": [
    FormElementType.CONTACT_INFO,
    FormElementType.EMAIL,
    FormElementType.PHONE,
    FormElementType.ADDRESS,
    FormElementType.WEBSITE,
  ],
  Choice: [
    FormElementType.MULTIPLE_CHOICE,
    FormElementType.DROPDOWN,
    FormElementType.PICTURE_CHOICE,
  ],
  Text: [FormElementType.LONG_TEXT, FormElementType.SHORT_TEXT],
  Other: [
    FormElementType.NUMBER,
    FormElementType.DATE,
    FormElementType.FILE_UPLOAD,
    FormElementType.WELCOME_SCREEN,
    FormElementType.STATEMENT,
    FormElementType.END_SCREEN,
    FormElementType.REDIRECT,
  ],
} as const;

export function ElementToolbar({ className }: { className?: string }) {
  const { dispatch } = useFormContext();

  const createNewElement = (type: FormElementType) => {
    const baseElement = {
      id: nanoid(),
      type,
      question: `New ${type} question`,
      required: false,
      order: Date.now(),
    };

    let properties;
    switch (type) {
      case FormElementType.CONTACT_INFO:
        properties = {
          placeholders: { firstName: "First Name", lastName: "Last Name" },
          showMiddleName: false,
        };
        break;
      // Add other cases...
      default:
        properties = {};
    }

    dispatch({
      type: "ADD_ELEMENT",
      payload: { ...baseElement, properties } as FormElement,
    });
  };

  return (
    <div className={cn("p-4 space-y-6", className)}>
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
                {elements.map((type, index) => (
                  <Draggable
                    key={type}
                    draggableId={`toolbar-${type}`}
                    index={index}
                  >
                    {(provided) => (
                      <Button
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => createNewElement(type)}
                      >
                        {type}
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
  );
}

import { createContext, useContext, useReducer, ReactNode } from "react";
import { Form, FormElement, FormElementProperties } from "@/types/form";

type FormState = {
  elements: FormElement[];
  activeElementId: string | null;
  isPreviewMode: boolean;
  title: string;
  description: string | null;
  settings: Form["settings"];
};

type FormAction =
  | { type: "SET_INITIAL_STATE"; payload: Partial<FormState> }
  | { type: "ADD_ELEMENT"; payload: FormElement }
  | {
      type: "UPDATE_ELEMENT";
      payload: {
        id: string;
        updates: Partial<Omit<FormElement, "type" | "properties">> &
          Partial<FormElementProperties>;
      };
    }
  | { type: "DELETE_ELEMENT"; payload: string }
  | { type: "REORDER_ELEMENTS"; payload: FormElement[] }
  | { type: "SET_ACTIVE_ELEMENT"; payload: string | null }
  | {
      type: "UPDATE_FORM_DETAILS";
      payload: { title?: string; description?: string | null };
    }
  | { type: "UPDATE_SETTINGS"; payload: Partial<Form["settings"]> };

const initialState: FormState = {
  elements: [],
  activeElementId: null,
  isPreviewMode: false,
  title: "Untitled Form",
  description: null,
  settings: {
    theme: {
      primaryColor: "#0f172a",
      fontFamily: "Inter",
      backgroundColor: "#ffffff",
      questionColor: "#0f172a",
    },
    behavior: {
      showProgressBar: true,
      enableKeyboardNavigation: true,
      requireLogin: false,
      limitResponses: false,
    },
    notifications: {
      enableEmailNotifications: false,
      notificationEmails: [],
    },
  },
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return { ...initialState, ...action.payload };

    case "ADD_ELEMENT":
      return {
        ...state,
        elements: [...state.elements, action.payload],
      };

    case "UPDATE_ELEMENT": {
      return {
        ...state,
        elements: state.elements.map((element) => {
          if (element.id !== action.payload.id) return element;

          // Preserve the element's type and ensure type-safe property updates
          return {
            ...element,
            ...action.payload.updates,
            type: element.type, // Keep original type
            properties: {
              ...element.properties,
              ...(action.payload.updates.properties || {}),
            },
          } as FormElement;
        }),
      };
    }

    case "DELETE_ELEMENT":
      return {
        ...state,
        elements: state.elements.filter(
          (element) => element.id !== action.payload
        ),
      };

    case "REORDER_ELEMENTS":
      return {
        ...state,
        elements: action.payload,
      };

    case "SET_ACTIVE_ELEMENT":
      return {
        ...state,
        activeElementId: action.payload,
      };

    case "UPDATE_FORM_DETAILS":
      return {
        ...state,
        ...(action.payload.title !== undefined && {
          title: action.payload.title,
        }),
        ...(action.payload.description !== undefined && {
          description: action.payload.description,
        }),
      };

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    default:
      return state;
  }
}

const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | null>(null);

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within FormProvider");
  }
  return context;
}

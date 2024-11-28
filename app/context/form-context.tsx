import { createContext, useContext, useReducer, ReactNode } from "react";
import { FormElement } from "@/types/form";

type FormState = {
  elements: FormElement[];
  activeElementId: string | null;
  isPreviewMode: boolean;
};

type FormAction =
  | { type: "ADD_ELEMENT"; payload: FormElement }
  | {
      type: "UPDATE_ELEMENT";
      payload: { id: string; updates: Partial<FormElement> };
    }
  | { type: "DELETE_ELEMENT"; payload: string }
  | { type: "REORDER_ELEMENTS"; payload: FormElement[] }
  | { type: "SET_ACTIVE_ELEMENT"; payload: string | null }
  | { type: "SET_INITIAL_STATE"; payload: { elements: FormElement[] } }
  | { type: "TOGGLE_PREVIEW_MODE" };

const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | null>(null);

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "ADD_ELEMENT":
      return {
        ...state,
        elements: [...state.elements, action.payload],
      };
    case "UPDATE_ELEMENT":
      return {
        ...state,
        elements: state.elements.map((element) =>
          element.id === action.payload.id
            ? ({ ...element, ...action.payload.updates } as FormElement)
            : element
        ),
      };
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
    case "SET_INITIAL_STATE":
      return {
        ...state,
        elements: action.payload.elements,
      };
    case "TOGGLE_PREVIEW_MODE":
      return {
        ...state,
        isPreviewMode: !state.isPreviewMode,
      };
    default:
      return state;
  }
};

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(formReducer, {
    elements: [],
    activeElementId: null,
    isPreviewMode: false,
  });

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within FormProvider");
  }
  return context;
};

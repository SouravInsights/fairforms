import { createContext, useContext, useReducer, ReactNode } from "react";
import { Form, FormElement, FormElementProperties } from "@/types/form";

/**
 * Defines the shape of our form's state
 */
type FormState = {
  /** Array of form elements (questions, inputs, etc.) */
  elements: FormElement[];
  /** ID of the currently selected element, null if nothing is selected */
  activeElementId: string | null;
  /** Whether we're in preview mode or edit mode */
  isPreviewMode: boolean;
  /** The form's title */
  title: string;
  /** Optional form description */
  description: string | null;
  /** Form settings like theme, behavior, etc. */
  settings: Form["settings"];
};

/**
 * Defines all possible actions that can modify our form state.
 * This is a union type using TypeScript's discriminated unions.
 *
 * Read more about TypeScript's discriminated unions:
 * https://dev.to/darkmavis1980/what-are-typescript-discriminated-unions-5hbb
 *
 * Each action has a 'type' property that tells us what kind of action it is,
 * and a 'payload' containing the data needed for that action.
 */
type FormAction =
  /** Sets the initial state when loading a form */
  | { type: "SET_INITIAL_STATE"; payload: Partial<FormState> }
  /** Adds a new element to the form */
  | { type: "ADD_ELEMENT"; payload: FormElement }
  /** Updates an existing element
   * I'm using Omit to prevent changing the element's type,
   * and make sure property updates match the element's type
   */
  | {
      type: "UPDATE_ELEMENT";
      payload: {
        id: string;
        updates: Partial<Omit<FormElement, "type" | "properties">> &
          Partial<FormElementProperties>;
      };
    }
  /** Deletes an element by its ID */
  | { type: "DELETE_ELEMENT"; payload: string }
  /** Reorders elements (used for drag and drop) */
  | { type: "REORDER_ELEMENTS"; payload: FormElement[] }
  /** Sets which element is currently active/selected */
  | { type: "SET_ACTIVE_ELEMENT"; payload: string | null }
  /** Updates form title and/or description */
  | {
      type: "UPDATE_FORM_DETAILS";
      payload: { title?: string; description?: string | null };
    }
  /** Updates form settings */
  | { type: "UPDATE_SETTINGS"; payload: Partial<Form["settings"]> };

/**
 * The default state for a new form.
 */
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

/**
 * This function handles all state updates.
 * It takes the current state and an action,
 * and returns the new state based on what the action wants to do.
 */
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      // When loading an existing form, merge it with our initial state
      // This ensures we have all required properties
      return { ...initialState, ...action.payload };

    case "ADD_ELEMENT":
      // Add a new element to the end of the elements array
      return {
        ...state,
        elements: [...state.elements, action.payload],
      };

    case "UPDATE_ELEMENT": {
      // Update a specific element while preserving its type
      return {
        ...state,
        elements: state.elements.map((element) => {
          // If this isn't the element we're updating, leave it unchanged
          if (element.id !== action.payload.id) return element;

          // If it is the element we're updating:
          // 1. Spread the existing element
          // 2. Apply the updates
          // 3. Ensure we keep the original type
          // 4. Merge any property updates
          return {
            ...element,
            ...action.payload.updates,
            type: element.type, // Important: keep the original type
            properties: {
              ...element.properties,
              ...(action.payload.updates.properties || {}),
            },
          } as FormElement;
        }),
      };
    }

    case "DELETE_ELEMENT":
      // Filter out the element with the specified ID
      return {
        ...state,
        elements: state.elements.filter(
          (element) => element.id !== action.payload
        ),
      };

    case "REORDER_ELEMENTS":
      // Replace the entire elements array with the new order
      return {
        ...state,
        elements: action.payload,
      };

    case "SET_ACTIVE_ELEMENT":
      // Update which element is currently selected
      return {
        ...state,
        activeElementId: action.payload,
      };

    case "UPDATE_FORM_DETAILS":
      // Update title and description only if they're provided
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
      // Merge new settings with existing ones
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
  // useReducer gives us the current state and a dispatch function to update it
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

/**
 * A basic explanation of the entire state flow in our Form Builder an example:
 *
 * Initial Form State:
 * {
 *   title: "Untitled Form",
 *   description: null,
 *   elements: [],
 *   activeElementId: null,
 *   isPreviewMode: false,
 *   settings: { ... }
 * }
 *
 * Now imagine a user is building a survey. Here's what happens:
 *
 * 1. User clicks "Add Multiple Choice Question":
 *    dispatch({
 *      type: "ADD_ELEMENT",
 *      payload: {
 *        id: "mc-123",
 *        type: "multiple_choice",
 *        question: "New multiple choice question",
 *        required: false,
 *        properties: {
 *          options: [{ id: "opt1", text: "Option 1" }],
 *          allowMultiple: false,
 *          randomizeOrder: false
 *        }
 *      }
 *    })
 *
 * 2. User clicks the question to edit it:
 *    dispatch({
 *      type: "SET_ACTIVE_ELEMENT",
 *      payload: "mc-123"
 *    })
 *
 * 3. User updates the question text:
 *    dispatch({
 *      type: "UPDATE_ELEMENT",
 *      payload: {
 *        id: "mc-123",
 *        updates: {
 *          question: "What's your favorite color?"
 *        }
 *      }
 *    })
 *
 * 4. User adds more options:
 *    dispatch({
 *      type: "UPDATE_ELEMENT",
 *      payload: {
 *        id: "mc-123",
 *        updates: {
 *          properties: {
 *            options: [
 *              { id: "opt1", text: "Red" },
 *              { id: "opt2", text: "Blue" },
 *              { id: "opt3", text: "Green" }
 *            ]
 *          }
 *        }
 *      }
 *    })
 *
 * 5. User drags questions to reorder them:
 *    dispatch({
 *      type: "REORDER_ELEMENTS",
 *      payload: [updatedElementsArray]
 *    })
 *
 * 6. User updates form title:
 *    dispatch({
 *      type: "UPDATE_FORM_DETAILS",
 *      payload: {
 *        title: "Color Preference Survey"
 *      }
 *    })
 *
 * At each step:
 * 1. Action is dispatched from a component
 * 2. formReducer receives current state and the action
 * 3. Based on action.type, appropriate case in switch statement runs
 * 4. New state is created (never mutating the old state)
 * 5. Components using useFormContext() re-render with new state
 *
 * Common Patterns:
 * - Adding items: [...array, newItem]
 * - Updating items: array.map(item => item.id === id ? {...item, ...updates} : item)
 * - Removing items: array.filter(item => item.id !== id)
 * - Reordering: Just replace the entire array
 * - Updating nested objects: {...object, nested: {...object.nested, ...updates}}
 */

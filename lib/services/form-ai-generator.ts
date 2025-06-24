import { nanoid } from "nanoid";
import { FormElement, FormElementType } from "@/types/form";
import { getDefaultProperties } from "@/app/components/form-builder/form-utils";
import { generateText } from "./huggingface";

interface GeneratedForm {
  title: string;
  description: string;
  elements: FormElement[];
}

interface FieldDefinition {
  type: string;
  question: string;
  description?: string;
  required: boolean;
  options?: string[];
}

interface FormDefinition {
  title: string;
  description: string;
  fields: FieldDefinition[];
}

// Generates a form structure using AI based on a text input by users
export async function generateForm(prompt: string): Promise<GeneratedForm> {
  try {
    // understansd the prompt and generates a structured form definition
    const formDefinition = await generateFormDefinitionWithAI(prompt);

    // converts the structured definition to actual form elements
    const elements = createFormElementsFromDefinition(formDefinition);

    return {
      title: formDefinition.title,
      description: formDefinition.description,
      elements,
    };
  } catch (error) {
    console.error("AI Form generation error:", error);
    // fall back to rule-based generation if AI fails
    return generateFallbackForm(prompt);
  }
}

// function to generate a structured form definition from a prompt
async function generateFormDefinitionWithAI(
  prompt: string
): Promise<FormDefinition> {
  const aiPrompt = `
You are a form-building assistant. Based on the following description, create a JSON structure that describes a form:

"${prompt}"

Your response should be a valid JSON object with the following structure:
{
  "title": "Form title here",
  "description": "Brief description of the form",
  "fields": [
    {
      "type": "ONE OF: SHORT_TEXT, LONG_TEXT, EMAIL, PHONE, CONTACT_INFO, MULTIPLE_CHOICE, DROPDOWN, DATE, NUMBER, FILE_UPLOAD, ADDRESS",
      "question": "Question text",
      "description": "Optional help text",
      "required": true or false,
      "options": ["Option 1", "Option 2"] 
    }
  ]
}

Keep the form design user-friendly: start with a welcome screen, include only relevant fields based on the description, and end with a thank you screen.

Your response should be ONLY the JSON object, nothing else before or after.
`;

  try {
    // Using Mistral-7B model because it's good at following structured output instructions
    const response = await generateText(aiPrompt, {
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      maxTokens: 1024,
      temperature: 0.2,
    });

    // Extract and parse the JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from AI response");
    }

    try {
      const formDefinition = JSON.parse(jsonMatch[0]);
      console.log("formDefinition:", formDefinition);

      // Validate the structure
      if (
        !formDefinition.title ||
        !formDefinition.description ||
        !Array.isArray(formDefinition.fields)
      ) {
        throw new Error("Invalid form definition structure");
      }

      return formDefinition;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.log("Raw AI response:", response);
      throw new Error("Failed to parse form definition from AI response");
    }
  } catch (error) {
    console.error("AI generation error:", error);
    throw error;
  }
}

// Create form elements from the structured form definition
function createFormElementsFromDefinition(
  formDefinition: FormDefinition
): FormElement[] {
  // We sjould always prefer to add welcome screen element by default
  const welcomeScreen = createWelcomeScreen(
    formDefinition.title,
    formDefinition.description
  );

  // Create form field elements (filtering out any null results)
  const fieldElements = formDefinition.fields
    .map((field, index) => createFormElementFromField(field, index + 1))
    .filter((element): element is FormElement => element !== null);
  console.log("fieldElements:", fieldElements);

  const allElements = [welcomeScreen, ...fieldElements];
  console.log("allElements:", allElements);

  // 5. Set the correct order property for each element
  return allElements.map((element, index) => ({
    ...element,
    order: index,
  }));
}

// Create a form element using the field definition
function createFormElementFromField(
  field: FieldDefinition,
  order: number
): FormElement | null {
  const id = `field-${nanoid(8)}`;
  let elementType: FormElementType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let properties: any;

  // Map the field type to a form element type
  switch (field.type.toUpperCase()) {
    case "SHORT_TEXT":
      elementType = FormElementType.SHORT_TEXT;
      properties = getDefaultProperties(FormElementType.SHORT_TEXT);
      break;
    case "LONG_TEXT":
      elementType = FormElementType.LONG_TEXT;
      properties = getDefaultProperties(FormElementType.LONG_TEXT);
      break;
    case "EMAIL":
      elementType = FormElementType.EMAIL;
      properties = getDefaultProperties(FormElementType.EMAIL);
      break;
    case "PHONE":
      elementType = FormElementType.PHONE;
      properties = getDefaultProperties(FormElementType.PHONE);
      break;
    case "CONTACT_INFO":
      elementType = FormElementType.CONTACT_INFO;
      properties = getDefaultProperties(FormElementType.CONTACT_INFO);
      break;
    case "MULTIPLE_CHOICE":
      elementType = FormElementType.MULTIPLE_CHOICE;
      properties = getDefaultProperties(FormElementType.MULTIPLE_CHOICE);
      // If options are provided, use them
      if (field.options && Array.isArray(field.options)) {
        properties.options = field.options.map((option, index) => ({
          id: `option${index + 1}-${nanoid(4)}`,
          text: option,
        }));
      }
      break;
    case "DROPDOWN":
      elementType = FormElementType.DROPDOWN;
      properties = getDefaultProperties(FormElementType.DROPDOWN);
      // If options are provided, use them
      if (field.options && Array.isArray(field.options)) {
        properties.options = field.options.map((option, index) => ({
          id: `option${index + 1}-${nanoid(4)}`,
          text: option,
        }));
      }
      break;
    case "DATE":
      elementType = FormElementType.DATE;
      properties = getDefaultProperties(FormElementType.DATE);
      break;
    case "NUMBER":
      elementType = FormElementType.NUMBER;
      properties = getDefaultProperties(FormElementType.NUMBER);
      break;
    case "FILE_UPLOAD":
      elementType = FormElementType.FILE_UPLOAD;
      properties = getDefaultProperties(FormElementType.FILE_UPLOAD);
      break;
    case "ADDRESS":
      elementType = FormElementType.ADDRESS;
      properties = getDefaultProperties(FormElementType.ADDRESS);
      break;
    default:
      // Skip unrecognized field types
      console.warn(`Unrecognized field type: ${field.type}`);
      return null;
  }

  return {
    id,
    type: elementType,
    question: field.question || "Question",
    description: field.description || "",
    required: !!field.required,
    order,
    properties,
  } as FormElement;
}

// Generate a fallback form for when AI generation fails
function generateFallbackForm(prompt: string): GeneratedForm {
  const normalizedPrompt = prompt.toLowerCase();

  // Try to extract a form title from the prompt
  let title = "Generated Form";
  if (normalizedPrompt.includes("contact")) {
    title = "Contact Form";
  } else if (normalizedPrompt.includes("feedback")) {
    title = "Feedback Form";
  } else if (normalizedPrompt.includes("event")) {
    title = "Event Registration";
  } else if (
    normalizedPrompt.includes("job") ||
    normalizedPrompt.includes("application")
  ) {
    title = "Job Application";
  }

  const description = `${title} created from your description`;

  // Create a basic form with common fields
  const elements: FormElement[] = [
    createWelcomeScreen(title, description),
    createNameField(),
    createEmailField(),
    createMessageField(),
    createEndScreen(),
  ];

  // Assign order numbers
  elements.forEach((element, index) => {
    element.order = index;
  });

  return {
    title,
    description,
    elements,
  };
}

// Helper functions to create various form elements
function createWelcomeScreen(title: string, description: string): FormElement {
  const id = `welcome-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.WELCOME_SCREEN);

  return {
    id,
    type: FormElementType.WELCOME_SCREEN,
    question: "",
    required: false,
    order: 0,
    properties: {
      ...properties,
      title: title || "Welcome",
      subtitle: description || "Please take a moment to fill out this form",
      buttonText: "Start",
    },
  } as FormElement;
}

function createEndScreen(): FormElement {
  const id = `end-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.END_SCREEN);

  return {
    id,
    type: FormElementType.END_SCREEN,
    question: "",
    required: false,
    order: 999,
    properties: {
      ...properties,
      title: "Thank you!",
      message: "Your response has been submitted successfully.",
      buttonText: "Done",
    },
  } as FormElement;
}

function createNameField(): FormElement {
  const id = `name-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.CONTACT_INFO);

  return {
    id,
    type: FormElementType.CONTACT_INFO,
    question: "What is your name?",
    description: "",
    required: true,
    order: 0,
    properties,
  } as FormElement;
}

function createEmailField(): FormElement {
  const id = `email-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.EMAIL);

  return {
    id,
    type: FormElementType.EMAIL,
    question: "What is your email address?",
    description: "",
    required: true,
    order: 0,
    properties,
  } as FormElement;
}

function createMessageField(): FormElement {
  const id = `message-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.LONG_TEXT);

  return {
    id,
    type: FormElementType.LONG_TEXT,
    question: "Your message",
    description: "Please provide any additional information",
    required: true,
    order: 0,
    properties: {
      ...properties,
      placeholder: "Enter your message here",
    },
  } as FormElement;
}

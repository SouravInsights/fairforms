import { nanoid } from "nanoid";
import { FormElement, FormElementType } from "@/types/form";
import { getDefaultProperties } from "@/app/components/form-builder/form-utils";

interface GeneratedForm {
  title: string;
  description: string;
  elements: FormElement[];
}

/**
 * Core function to generate a form structure from a text description
 */
export async function generateForm(prompt: string): Promise<GeneratedForm> {
  try {
    // Analyze the prompt to determine form type and fields
    const formType = determineFormType(prompt);
    const formStructure = parsePromptToFormStructure(prompt, formType);

    return {
      title: formStructure.title || "Generated Form",
      description: formStructure.description || "",
      elements: formStructure.elements,
    };
  } catch (error) {
    console.error("Form generation error:", error);
    // Fallback to basic form if generation fails
    return createBasicForm(prompt);
  }
}

/**
 * Determine the type of form based on the prompt
 */
function determineFormType(prompt: string): string {
  const normalizedPrompt = prompt.toLowerCase();

  if (
    normalizedPrompt.includes("contact") ||
    normalizedPrompt.includes("get in touch")
  ) {
    return "contact";
  } else if (
    normalizedPrompt.includes("feedback") ||
    normalizedPrompt.includes("survey")
  ) {
    return "feedback";
  } else if (
    normalizedPrompt.includes("event") ||
    normalizedPrompt.includes("registration")
  ) {
    return "event";
  } else if (
    normalizedPrompt.includes("job") ||
    normalizedPrompt.includes("application")
  ) {
    return "job";
  } else if (
    normalizedPrompt.includes("order") ||
    normalizedPrompt.includes("purchase")
  ) {
    return "order";
  }

  // Default to contact if no match is founded. This needs to be updated later..
  return "contact";
}

/**
 * Parse a prompt to extract form details and generate a form structure
 */
function parsePromptToFormStructure(
  prompt: string,
  formType: string
): {
  title: string;
  description: string;
  elements: FormElement[];
} {
  const normalizedPrompt = prompt.toLowerCase();
  const elements: FormElement[] = [];

  // 1. Generate a title and description based on the form type
  let title = "Form";
  let description = "";

  switch (formType) {
    case "contact":
      title = normalizedPrompt.includes("us") ? "Contact Us" : "Contact Form";
      description = "Please fill out this form to get in touch with us";
      break;
    case "feedback":
      title = "Feedback Form";
      description = "Share your thoughts and help us improve";
      if (normalizedPrompt.includes("customer")) {
        title = "Customer Feedback";
        description = "We value your feedback about our products and services";
      }
      break;
    case "event":
      title = "Event Registration";
      description = "Sign up for our upcoming event";
      break;
    case "job":
      title = "Job Application";
      description = "Apply for a position with our company";
      break;
    case "order":
      title = "Order Form";
      description = "Complete your purchase";
      break;
  }

  // 2. Add welcome screen
  elements.push(createWelcomeScreen(title, description));

  // 3. Add form fields based on form type
  switch (formType) {
    case "contact":
      elements.push(createNameField());
      elements.push(createEmailField());

      if (normalizedPrompt.includes("phone")) {
        elements.push(createPhoneField());
      }

      elements.push(createMessageField());
      break;

    case "feedback":
      elements.push(createNameField());
      elements.push(createEmailField());

      if (
        normalizedPrompt.includes("rating") ||
        normalizedPrompt.includes("star")
      ) {
        elements.push(createRatingField());
      }

      if (
        normalizedPrompt.includes("product") ||
        normalizedPrompt.includes("service")
      ) {
        const options = [
          "Product A",
          "Product B",
          "Service 1",
          "Service 2",
          "Other",
        ];
        elements.push(createMultipleChoiceField("What did you use?", options));
      }

      elements.push(
        createLongTextField(
          "Your feedback",
          "Please share your thoughts with us"
        )
      );
      break;

    case "event":
      elements.push(createNameField());
      elements.push(createEmailField());

      if (normalizedPrompt.includes("phone")) {
        elements.push(createPhoneField());
      }

      elements.push(createDateField("Event Date", "When will you attend?"));

      if (
        normalizedPrompt.includes("diet") ||
        normalizedPrompt.includes("food") ||
        normalizedPrompt.includes("preference")
      ) {
        const options = [
          "No restrictions",
          "Vegetarian",
          "Vegan",
          "Gluten-free",
          "Other",
        ];
        elements.push(
          createMultipleChoiceField("Dietary Preferences", options)
        );
      }

      elements.push(
        createMultipleChoiceField("Will you attend?", ["Yes", "No", "Maybe"])
      );
      break;

    case "job":
      elements.push(createNameField());
      elements.push(createEmailField());
      elements.push(createPhoneField());
      elements.push(
        createLongTextField(
          "Work Experience",
          "Please describe your relevant work experience"
        )
      );
      elements.push(
        createLongTextField(
          "Education",
          "Please provide details of your education"
        )
      );
      elements.push(
        createFileUploadField("Resume/CV", "Please upload your resume or CV")
      );
      break;

    case "order":
      elements.push(createNameField());
      elements.push(createEmailField());
      elements.push(createAddressField());

      if (normalizedPrompt.includes("product")) {
        const options = ["Product A", "Product B", "Product C", "Custom Order"];
        elements.push(createMultipleChoiceField("Product Selection", options));
      }

      elements.push(
        createLongTextField(
          "Special Instructions",
          "Any special requests for your order?"
        )
      );
      break;

    default:
      // Default to a simple contact form
      elements.push(createNameField());
      elements.push(createEmailField());
      elements.push(createMessageField());
  }

  // 4. Add end screen
  elements.push(createEndScreen());

  // 5. Assign order numbers
  elements.forEach((element, index) => {
    element.order = index;
  });

  return { title, description, elements };
}

/**
 * Create a basic form (fallback if parsing fails)
 */
function createBasicForm(prompt: string): GeneratedForm {
  const formType = determineFormType(prompt);
  let title = "Form";
  let description = "Please fill out this form";

  if (formType === "contact") {
    title = "Contact Form";
    description = "Please fill out this form to get in touch with us";
  } else if (formType === "feedback") {
    title = "Feedback Form";
    description = "We appreciate your feedback";
  }

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

// Helper functions to create form elements
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

function createPhoneField(): FormElement {
  const id = `phone-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.PHONE);

  return {
    id,
    type: FormElementType.PHONE,
    question: "What is your phone number?",
    description: "",
    required: false,
    order: 0,
    properties,
  } as FormElement;
}

function createAddressField(): FormElement {
  const id = `address-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.ADDRESS);

  return {
    id,
    type: FormElementType.ADDRESS,
    question: "What is your address?",
    description: "Please provide your shipping address",
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

function createLongTextField(
  question: string,
  description: string
): FormElement {
  const id = `text-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.LONG_TEXT);

  return {
    id,
    type: FormElementType.LONG_TEXT,
    question,
    description,
    required: true,
    order: 0,
    properties: {
      ...properties,
      placeholder: "Enter your response here",
    },
  } as FormElement;
}

function createMultipleChoiceField(
  question: string,
  options: string[]
): FormElement {
  const id = `choice-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.MULTIPLE_CHOICE);

  return {
    id,
    type: FormElementType.MULTIPLE_CHOICE,
    question,
    description: "",
    required: true,
    order: 0,
    properties: {
      ...properties,
      options: options.map((text, index) => ({
        id: `option${index + 1}-${nanoid(4)}`,
        text,
      })),
    },
  } as FormElement;
}

function createRatingField(): FormElement {
  const id = `rating-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.MULTIPLE_CHOICE);

  return {
    id,
    type: FormElementType.MULTIPLE_CHOICE,
    question: "How would you rate your experience?",
    description: "Please select a rating from 1 to 5",
    required: true,
    order: 0,
    properties: {
      ...properties,
      options: [
        { id: `rating1-${nanoid(4)}`, text: "1 - Poor" },
        { id: `rating2-${nanoid(4)}`, text: "2 - Below Average" },
        { id: `rating3-${nanoid(4)}`, text: "3 - Average" },
        { id: `rating4-${nanoid(4)}`, text: "4 - Good" },
        { id: `rating5-${nanoid(4)}`, text: "5 - Excellent" },
      ],
    },
  } as FormElement;
}

function createFileUploadField(
  question: string,
  description: string
): FormElement {
  const id = `file-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.FILE_UPLOAD);

  return {
    id,
    type: FormElementType.FILE_UPLOAD,
    question,
    description,
    required: false,
    order: 0,
    properties,
  } as FormElement;
}

function createDateField(question: string, description: string): FormElement {
  const id = `date-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.DATE);

  return {
    id,
    type: FormElementType.DATE,
    question,
    description,
    required: true,
    order: 0,
    properties,
  } as FormElement;
}

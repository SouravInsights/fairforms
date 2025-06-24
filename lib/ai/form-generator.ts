import { nanoid } from "nanoid";
import { FormElement, FormElementType } from "@/types/form";
import { getDefaultProperties } from "@/app/components/form-builder/form-utils";

interface GeneratedForm {
  title: string;
  description: string;
  elements: FormElement[];
}

// Rule-based approach to parse the prompt
// Later, I'll replace it with a more sophisticated AI model
export async function createFormFromPrompt(
  prompt: string
): Promise<GeneratedForm> {
  const normalizedPrompt = prompt.toLowerCase();

  // Extract a title from the prompt
  let title = "Generated Form";
  if (normalizedPrompt.includes("contact form")) {
    title = "Contact Form";
  } else if (
    normalizedPrompt.includes("feedback") ||
    normalizedPrompt.includes("survey")
  ) {
    title = "Feedback Survey";
  } else if (
    normalizedPrompt.includes("registration") ||
    normalizedPrompt.includes("event")
  ) {
    title = "Event Registration";
  } else if (
    normalizedPrompt.includes("application") ||
    normalizedPrompt.includes("job")
  ) {
    title = "Job Application";
  } else if (
    normalizedPrompt.includes("order") ||
    normalizedPrompt.includes("purchase")
  ) {
    title = "Order Form";
  }

  // Generate a default description
  const description = `${title} created from your description`;

  // Parse the prompt to identify form elements
  const elements: FormElement[] = [];

  // Add a welcome screen
  elements.push(createWelcomeScreen(title));

  // Basic pattern matching to extract form fields
  // In a real implementation, I would use a better NLP approach

  // Check for contact form elements
  if (normalizedPrompt.includes("name")) {
    elements.push(createNameField());
  }

  if (normalizedPrompt.includes("email")) {
    elements.push(createEmailField());
  }

  if (normalizedPrompt.includes("phone")) {
    elements.push(createPhoneField());
  }

  if (
    normalizedPrompt.includes("message") ||
    normalizedPrompt.includes("comment")
  ) {
    elements.push(createMessageField());
  }

  // Check for multiple choice elements
  if (
    normalizedPrompt.includes("multiple choice") ||
    normalizedPrompt.includes("choice")
  ) {
    // Look for rating patterns
    if (
      normalizedPrompt.includes("rating") ||
      normalizedPrompt.includes("scale") ||
      normalizedPrompt.includes("1-5") ||
      normalizedPrompt.includes("1 to 5")
    ) {
      elements.push(createRatingField("How would you rate our service?"));
    } else {
      elements.push(createMultipleChoiceField("Please select an option:"));
    }
  }

  // Check for dropdown elements
  if (
    normalizedPrompt.includes("dropdown") ||
    normalizedPrompt.includes("select")
  ) {
    elements.push(createDropdownField("Please select an option:"));
  }

  // Check for file upload elements
  if (
    normalizedPrompt.includes("upload") ||
    normalizedPrompt.includes("file") ||
    normalizedPrompt.includes("resume") ||
    normalizedPrompt.includes("cv")
  ) {
    elements.push(createFileUploadField("Upload your file:"));
  }

  // Check for date elements
  if (normalizedPrompt.includes("date") || normalizedPrompt.includes("when")) {
    elements.push(createDateField("Select a date:"));
  }

  // Check for checkbox/agreement elements
  if (
    normalizedPrompt.includes("agree") ||
    normalizedPrompt.includes("consent") ||
    normalizedPrompt.includes("terms") ||
    normalizedPrompt.includes("checkbox")
  ) {
    elements.push(createAgreementField());
  }

  // Add an end screen
  elements.push(createEndScreen());

  // If we somehow didn't create any elements, add some default ones
  if (elements.length <= 2) {
    // Only has welcome and end screens
    elements.splice(
      1,
      0,
      createNameField(),
      createEmailField(),
      createMessageField()
    );
  }

  // Assign order numbers to all elements
  elements.forEach((element, index) => {
    element.order = index;
  });

  return {
    title,
    description,
    elements,
  };
}

// Helper functions to create different form elements

function createWelcomeScreen(title: string): FormElement {
  const id = `welcome-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.WELCOME_SCREEN);

  return {
    id,
    type: FormElementType.WELCOME_SCREEN,
    required: false,
    order: 0,
    properties: {
      ...properties,
      title,
      subtitle: "Please take a moment to fill out this form",
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

function createMultipleChoiceField(question: string): FormElement {
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
      options: [
        { id: `option1-${nanoid(4)}`, text: "Option 1" },
        { id: `option2-${nanoid(4)}`, text: "Option 2" },
        { id: `option3-${nanoid(4)}`, text: "Option 3" },
      ],
    },
  } as FormElement;
}

function createRatingField(question: string): FormElement {
  const id = `rating-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.MULTIPLE_CHOICE);

  return {
    id,
    type: FormElementType.MULTIPLE_CHOICE,
    question,
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

function createDropdownField(question: string): FormElement {
  const id = `dropdown-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.DROPDOWN);

  return {
    id,
    type: FormElementType.DROPDOWN,
    question,
    description: "",
    required: true,
    order: 0,
    properties,
  } as FormElement;
}

function createFileUploadField(question: string): FormElement {
  const id = `file-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.FILE_UPLOAD);

  return {
    id,
    type: FormElementType.FILE_UPLOAD,
    question,
    description: "Upload files here",
    required: false,
    order: 0,
    properties,
  } as FormElement;
}

function createDateField(question: string): FormElement {
  const id = `date-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.DATE);

  return {
    id,
    type: FormElementType.DATE,
    question,
    description: "",
    required: true,
    order: 0,
    properties,
  } as FormElement;
}

function createAgreementField(): FormElement {
  const id = `agreement-${nanoid(8)}`;
  const properties = getDefaultProperties(FormElementType.MULTIPLE_CHOICE);

  return {
    id,
    type: FormElementType.MULTIPLE_CHOICE,
    question: "Terms and Conditions",
    description: "Please accept our terms and conditions to proceed",
    required: true,
    order: 0,
    properties: {
      ...properties,
      options: [
        {
          id: `agree-${nanoid(4)}`,
          text: "I agree to the terms and conditions",
        },
      ],
    },
  } as FormElement;
}

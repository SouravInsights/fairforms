export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  tags: string[];
  previewFields?: string[];
}

// Collection of prompt templates for common form types
export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "contact",
    name: "Contact Form",
    description: "Basic contact form with name, email, and message fields",
    tags: ["business", "general"],
    prompt:
      "Create a contact form with fields for name, email, phone number, and a message box. Include validation for the email field and make the name and email fields required.",
    previewFields: ["Name", "Email", "Message"],
  },
  {
    id: "event",
    name: "Event Registration",
    description:
      "Form for registering for an event with personal and preference details",
    tags: ["business", "events"],
    prompt:
      "Create an event registration form with fields for name, email, phone number, dietary preferences (Vegetarian, Vegan, Non-vegetarian, Gluten-free), attendance date selection, and number of attendees. Add a checkbox for agreeing to event terms and conditions.",
    previewFields: ["Name", "Email", "Attendance Date", "Dietary Preferences"],
  },
  {
    id: "feedback",
    name: "Customer Feedback",
    description: "Detailed feedback form with ratings and open comments",
    tags: ["business", "customer service"],
    prompt:
      "Create a customer feedback form that includes a 5-point rating system for product quality, customer service, and delivery speed. Include a field for the customer's name and email, and a text area for additional comments or suggestions for improvement.",
    previewFields: ["Name", "Product Rating", "Service Rating", "Comments"],
  },
  {
    id: "job",
    name: "Job Application",
    description:
      "Comprehensive job application form with work history and skills",
    tags: ["business", "recruitment"],
    prompt:
      "Create a job application form with fields for personal information (name, email, phone), work experience (company, role, duration), education details, skills, and an option to upload a resume. Include a field for the applicant to write a cover letter or statement of interest.",
    previewFields: ["Name", "Email", "Experience", "Resume Upload"],
  },
  {
    id: "survey",
    name: "Market Research",
    description: "Survey with diverse question types for market research",
    tags: ["business", "research"],
    prompt:
      "Create a market research survey with demographic questions (age range, gender, location), multiple choice questions about product preferences, rating scales for different features, and open-ended questions about customer needs and pain points.",
    previewFields: ["Demographics", "Product Preferences", "Feature Ratings"],
  },
  {
    id: "product-order",
    name: "Product Order Form",
    description: "Form for customers to place product orders",
    tags: ["business", "e-commerce"],
    prompt:
      "Create a product order form with fields for customer information (name, email, shipping address), product selection with quantities, payment method selection, and special delivery instructions.",
    previewFields: [
      "Customer Name",
      "Shipping Address",
      "Products",
      "Payment Method",
    ],
  },
  {
    id: "rsvp",
    name: "RSVP Form",
    description: "Form for event RSVPs with guest options",
    tags: ["events", "personal"],
    prompt:
      "Create an RSVP form for a wedding or party with fields for name, email, attendance status (Yes/No/Maybe), number of guests, and any dietary restrictions or special needs.",
    previewFields: [
      "Name",
      "Attendance",
      "Guest Count",
      "Dietary Restrictions",
    ],
  },
  {
    id: "support",
    name: "Technical Support",
    description: "Form for submitting technical support requests",
    tags: ["business", "support"],
    prompt:
      "Create a technical support request form with fields for customer name, email, product/service name, issue type (dropdown with options like 'Bug', 'Feature Request', 'Account Issue', etc.), issue description, severity level, and an option to upload screenshots.",
    previewFields: ["Name", "Issue Type", "Description", "Severity"],
  },
  {
    id: "appointment",
    name: "Appointment Booking",
    description: "Form for booking appointments or consultations",
    tags: ["business", "service"],
    prompt:
      "Create an appointment booking form with fields for client name, email, phone number, preferred date and time (with at least 3 options), service type selection, and any special requests or notes for the appointment.",
    previewFields: [
      "Name",
      "Service Type",
      "Preferred Dates",
      "Special Requests",
    ],
  },
  {
    id: "subscription",
    name: "Newsletter Subscription",
    description: "Simple form for newsletter subscriptions",
    tags: ["marketing", "general"],
    prompt:
      "Create a newsletter subscription form with fields for name, email, interests or topics (multiple selection), preferred frequency (Daily, Weekly, Monthly), and consent for marketing communications.",
    previewFields: ["Name", "Email", "Interests", "Frequency"],
  },
];

/**
 * Find a prompt template by ID
 */
export function getPromptTemplateById(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((template) => template.id === id);
}

/**
 * Get prompt templates filtered by tags
 */
export function getPromptTemplatesByTags(tags: string[]): PromptTemplate[] {
  if (!tags || tags.length === 0) return PROMPT_TEMPLATES;

  return PROMPT_TEMPLATES.filter((template) =>
    tags.some((tag) => template.tags.includes(tag))
  );
}

/**
 * Search prompt templates by keyword
 */
export function searchPromptTemplates(query: string): PromptTemplate[] {
  if (!query) return PROMPT_TEMPLATES;

  const lowercaseQuery = query.toLowerCase();

  return PROMPT_TEMPLATES.filter(
    (template) =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}

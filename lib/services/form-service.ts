import { Form, ApiResponse } from "@/types/form";

export async function getPublicForm(
  formId: string
): Promise<ApiResponse<Form>> {
  try {
    const response = await fetch(`/api/forms/${formId}/public`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch form");
    }

    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

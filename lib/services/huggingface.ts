/* eslint-disable @typescript-eslint/no-explicit-any */

export async function queryHuggingFace(
  model: string,
  payload: any
): Promise<any> {
  const apiKey = process.env.HUGGINGFACE_API_KEY || "";
  const apiUrl = "https://api-inference.huggingface.co/models";

  try {
    const response = await fetch(`${apiUrl}/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Hugging Face API error: ${error.error || "Unknown error"}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Hugging Face API error:", error);
    throw error;
  }
}

export async function generateText(
  prompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<string> {
  // We are using the simple GPT-2 model but later we will have to use more robust model.
  const model = options.model || "gpt2";

  const payload = {
    inputs: prompt,
    parameters: {
      max_new_tokens: options.maxTokens || 256,
      temperature: options.temperature || 0.7,
      return_full_text: false,
    },
  };

  try {
    const result = await queryHuggingFace(model, payload);

    // Extract generated text from the response
    if (Array.isArray(result) && result.length > 0) {
      return result[0].generated_text;
    }

    return result.generated_text || "";
  } catch (error) {
    console.error("Text generation error:", error);
    return "";
  }
}

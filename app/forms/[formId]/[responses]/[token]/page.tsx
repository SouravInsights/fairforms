"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ResponseList } from "@/app/(dashboard)/dashboard/forms/[formId]/responses/ResponseList";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { EnrichedResponse } from "@/types/response";
import { Form } from "@/types/form";

interface PublicResponsesPageProps {
  params: {
    formId: string;
    token: string;
  };
}

interface SuccessResponse {
  form: Form;
  responses: EnrichedResponse[];
}

interface ErrorResponse {
  error: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function isErrorResponse(response: ApiResponse): response is ErrorResponse {
  return "error" in response;
}

export default function PublicResponsesPage({
  params,
}: PublicResponsesPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [responses, setResponses] = useState<EnrichedResponse[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadResponses = async () => {
      try {
        const response = await fetch(
          `/api/forms/${params.formId}/public/${params.token}`
        );

        console.log("response from page:", response);
        const data = (await response.json()) as ApiResponse;
        console.log("data from page:", data);

        if (!response.ok) {
          throw new Error(
            isErrorResponse(data) ? data.error : "Failed to load responses"
          );
        }

        if (isErrorResponse(data)) {
          throw new Error(data.error);
        }

        setForm(data.form);
        setResponses(data.responses);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to load responses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadResponses();
  }, [params.formId, params.token, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-2">
            Invalid or Expired Link
          </h2>
          <p className="text-muted-foreground">
            This link might be invalid or has expired. Please request a new link
            from the form owner.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{form.title} - Responses</h1>
        <p className="text-muted-foreground">
          {responses.length} total{" "}
          {responses.length === 1 ? "response" : "responses"}
        </p>
      </div>

      <ResponseList responses={responses} form={form} />
    </div>
  );
}

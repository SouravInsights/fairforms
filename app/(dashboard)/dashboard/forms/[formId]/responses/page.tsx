"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ResponseList } from "./ResponseList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsesPageSkeleton } from "./ResponsesPageSkeleton";
import { Form } from "@/types/form";
import { EnrichedResponse } from "@/types/response";

interface ResponsesPageProps {
  params: {
    formId: string;
  };
}

export default function ResponsesPage({ params }: ResponsesPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [responses, setResponses] = useState<EnrichedResponse[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadResponses = async () => {
      try {
        const response = await fetch(`/api/forms/${params.formId}/responses`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        setResponses(data.responses);
        setForm(data.form);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load responses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadResponses();
  }, [params.formId, toast]);

  if (isLoading || !form) {
    return <ResponsesPageSkeleton />;
  }

  console.log("responses:", responses);

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{form.title} - Responses</h1>
        <p className="text-muted-foreground">
          {responses.length} total{" "}
          {responses.length === 1 ? "response" : "responses"}
        </p>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <ResponseList responses={responses} form={form} />
        </TabsContent>
        <TabsContent value="stats" className="space-y-4">
          will be added later
        </TabsContent>
      </Tabs>
    </div>
  );
}

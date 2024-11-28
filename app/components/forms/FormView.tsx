"use client";

import { Form } from "@/types/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormElement } from "./elements";

interface FormViewProps {
  form: Form;
}

export function FormView({ form }: FormViewProps) {
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [responses, setResponses] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const currentElement = form.elements[currentElementIndex];
  const isLastElement = currentElementIndex === form.elements.length - 1;

  const handleNext = () => {
    if (!currentElement.required && !responses[currentElement.id]) {
      // If question is not required and no answer, we can skip
      setCurrentElementIndex((prev) => prev + 1);
      return;
    }

    if (currentElement.required && !responses[currentElement.id]) {
      toast({
        title: "Required Field",
        description: "Please answer this question before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setCurrentElementIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/forms/${form.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast({
        title: "Success!",
        description: "Your response has been recorded.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto py-12 space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{form.title}</h1>
          {form.description && (
            <p className="text-muted-foreground">{form.description}</p>
          )}
        </header>

        <main className="space-y-4">
          {currentElement && (
            <FormElement
              element={currentElement}
              value={responses[currentElement.id]}
              onChange={(value) =>
                setResponses((prev) => ({
                  ...prev,
                  [currentElement.id]: value,
                }))
              }
            />
          )}

          <div className="flex justify-end gap-2">
            {currentElementIndex > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentElementIndex((prev) => prev - 1)}
              >
                Previous
              </Button>
            )}

            {!isLastElement ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Submit</Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

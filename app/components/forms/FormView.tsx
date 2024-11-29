"use client";

import { Form } from "@/types/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormElement } from "./elements";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FormViewProps {
  form: Form;
  isPreview?: boolean;
  className?: string;
}

export function FormView({ form, isPreview, className }: FormViewProps) {
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [responses, setResponses] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const totalElements = form.elements.length;
  const progress = (currentElementIndex / totalElements) * 100;
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

  const handlePrevious = () => {
    setCurrentElementIndex((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (isPreview) {
      toast({
        title: "Preview Mode",
        description: "Form submission is disabled in preview mode",
      });
      return;
    }

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

  if (totalElements === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
        This form has no elements yet.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-background",
        className,
        isPreview ? "min-h-[400px]" : "min-h-screen"
      )}
    >
      <div
        className={cn(
          "container max-w-3xl mx-auto py-12 space-y-8",
          isPreview && "py-6"
        )}
      >
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{form.title}</h1>
          {form.description && (
            <p className="text-muted-foreground">{form.description}</p>
          )}
          {isPreview && (
            <div className="text-sm px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full inline-block">
              Preview Mode
            </div>
          )}
        </header>

        {form.settings.behavior.showProgressBar && (
          <Progress value={progress} className="h-2" />
        )}

        <main className="space-y-8">
          {currentElement && (
            <div className="bg-card rounded-lg p-6 shadow-sm">
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
            </div>
          )}

          <div className="flex justify-between">
            {currentElementIndex > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}

            {!isLastElement ? (
              <Button className="ml-auto" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button className="ml-auto" onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { Form } from "@/types/form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormElement } from "./elements";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

interface FormViewProps {
  form: Form;
  isPreview?: boolean;
  className?: string;
}

export function FormView({ form, isPreview, className }: FormViewProps) {
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [height, setHeight] = useState("100vh");
  const { toast } = useToast();

  useEffect(() => {
    const updateHeight = () => {
      setHeight(`${window.innerHeight}px`);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLastElement) {
      handleNext();
    } else if (e.key === "ArrowUp" && currentElementIndex > 0) {
      handlePrevious();
    }
  };

  return (
    <div
      className={cn(
        "bg-background",
        className,
        isPreview ? "min-h-[400px]" : ""
      )}
      style={{ height: isPreview ? "400px" : height }}
    >
      {form.settings.behavior.showProgressBar && (
        <Progress
          value={progress}
          className="fixed top-0 left-0 right-0 h-1 z-50"
        />
      )}

      <motion.div
        key={currentElementIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-full flex flex-col"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Main content with padding and auto scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="container max-w-3xl mx-auto py-12 px-4 md:px-8 min-h-full flex flex-col">
            {/* Center content vertically */}
            <div className="flex-1 flex flex-col justify-center">
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

            {/* Navigation buttons in a fixed position */}
            <div className="mt-8 flex justify-between items-center sticky bottom-0 pb-4 bg-background">
              {currentElementIndex > 0 && (
                <Button variant="ghost" size="sm" onClick={handlePrevious}>
                  Press ↑ for previous
                </Button>
              )}

              {!isLastElement ? (
                <Button className="ml-auto" onClick={handleNext} size="lg">
                  Press Enter ↵
                </Button>
              ) : (
                <Button className="ml-auto" onClick={handleSubmit} size="lg">
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>

        <ChevronDown
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-50"
          size={24}
        />
      </motion.div>
    </div>
  );
}

"use client";

import { Form, FormElementType } from "@/types/form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormElement } from "./elements";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2, CheckCircle2 } from "lucide-react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

    setIsSubmitting(true);

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

      // Show success animation
      setIsSuccess(true);

      // After success animation, show end screen if exists
      const hasEndScreen = form.elements.some(
        (element) => element.type === FormElementType.END_SCREEN
      );

      if (hasEndScreen) {
        // Find the end screen index
        const endScreenIndex = form.elements.findIndex(
          (element) => element.type === FormElementType.END_SCREEN
        );
        // Wait for success animation
        setTimeout(() => {
          setIsSuccess(false);
          setCurrentElementIndex(endScreenIndex);
        }, 2000);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Loading and Success screens
  const renderLoadingOrSuccess = () => {
    if (isSubmitting && !isSuccess) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold">
              Submitting your response...
            </h3>
          </motion.div>
        </motion.div>
      );
    }

    if (isSuccess) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.2, 1],
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              times: [0, 0.2, 1],
            }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
            >
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-semibold">Response submitted!</h3>
            <p className="text-muted-foreground mt-2">
              Thank you for your time.
            </p>
          </motion.div>
        </motion.div>
      );
    }

    return null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLastElement) {
      handleNext();
    } else if (e.key === "ArrowUp" && currentElementIndex > 0) {
      handlePrevious();
    }
  };

  const showNavigationButtons =
    currentElement.type !== FormElementType.WELCOME_SCREEN &&
    currentElement.type !== FormElementType.END_SCREEN;

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

      {renderLoadingOrSuccess()}

      <motion.div
        key={currentElementIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full flex flex-col"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Scrollable content area with padding bottom for chevron */}
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="container max-w-3xl mx-auto py-12 px-4 md:px-8 min-h-full">
            <div className="flex flex-col justify-center h-full">
              <FormElement
                element={currentElement}
                value={responses[currentElement.id]}
                onChange={(value) => {
                  setResponses((prev) => ({
                    ...prev,
                    [currentElement.id]: value,
                  }));

                  if (currentElement.type === FormElementType.WELCOME_SCREEN) {
                    handleNext();
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Fixed footer with navigation and chevron */}
        {showNavigationButtons && (
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-3xl mx-auto px-4 md:px-8">
              <div className="flex justify-between items-center py-4">
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

              {/* Chevron with backdrop */}
              <div className="absolute -top-12 left-0 right-0 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    y: [-5, 0, -5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ChevronDown className="text-foreground" size={24} />
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

"use client";

import { Form, FormElementType, FormElementValue } from "@/types/form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormElement } from "./elements";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useTokenGate } from "@/app/hooks/use-token-gate";
import { useFormRewards } from "@/app/hooks/use-form-rewards";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Web3Gate } from "./Web3Gate";
import { FormSubmissionFeedback } from "./FormSubmissionFeedback";

interface FormViewProps {
  form: Form;
  isPreview?: boolean;
  className?: string;
}

export function FormView({ form, isPreview, className }: FormViewProps) {
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, FormElementValue>>(
    {}
  );
  const [height, setHeight] = useState("100vh");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();
  const { connect } = useConnect();
  const { hasAccess, isConnected, address } = useTokenGate(
    form.settings.web3?.tokenGating
  );
  const { sendReward, isPending: isRewardPending } = useFormRewards(
    form.settings.web3?.rewards
  );

  useEffect(() => {
    const updateHeight = () => {
      setHeight(`${window.innerHeight}px`);
    };
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateHeight();
    checkMobile();

    window.addEventListener("resize", updateHeight);
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const totalElements = form.elements.length;
  const progress = (currentElementIndex / totalElements) * 100;
  const currentElement = form.elements[currentElementIndex];
  const isLastElement = currentElementIndex === form.elements.length - 1;

  const handleNext = () => {
    if (!currentElement.required && !responses[currentElement.id]) {
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

  const showRewardSuccess = Boolean(
    form.settings.web3?.enabled && form.settings.web3.rewards.enabled
  );

  // Token gate check
  if (form.settings.web3?.enabled && form.settings.web3.tokenGating.enabled) {
    return (
      <Web3Gate
        isConnected={isConnected}
        hasAccess={hasAccess}
        minTokenBalance={form.settings.web3.tokenGating.minTokenBalance}
        onConnect={() => connect({ connector: injected() })}
      />
    );
  }

  const handleSubmit = async () => {
    if (isPreview) {
      toast({
        title: "Preview Mode",
        description: "Form submission is disabled in preview mode",
      });
      return;
    }

    // Connect wallet if needed for rewards
    if (
      form.settings.web3?.enabled &&
      form.settings.web3.rewards.enabled &&
      !isConnected
    ) {
      connect({ connector: injected() });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/forms/${form.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responses,
          walletAddress: address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // Send reward if enabled
      if (
        form.settings.web3?.enabled &&
        form.settings.web3.rewards.enabled &&
        address &&
        form.settings.web3.rewards.rewardAmount
      ) {
        await sendReward(
          address,
          BigInt(form.settings.web3.rewards.rewardAmount)
        );
      }

      setIsSuccess(true);

      const hasEndScreen = form.elements.some(
        (element) => element.type === FormElementType.END_SCREEN
      );

      if (hasEndScreen) {
        const endScreenIndex = form.elements.findIndex(
          (element) => element.type === FormElementType.END_SCREEN
        );
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
    } finally {
      if (!form.elements.some((el) => el.type === FormElementType.END_SCREEN)) {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 2000);
      }
    }
  };

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

  const handleValueChange = (value: FormElementValue) => {
    setResponses((prev) => ({
      ...prev,
      [currentElement.id]: value,
    }));

    // Auto-advance for Welcome Screen and single-choice selection
    if (
      currentElement.type === FormElementType.WELCOME_SCREEN ||
      (currentElement.type === FormElementType.MULTIPLE_CHOICE &&
        !currentElement.properties.allowMultiple)
    ) {
      handleNext();
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

      {renderLoadingOrSuccess()}

      <FormSubmissionFeedback
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        isRewardPending={isRewardPending}
        showRewardSuccess={showRewardSuccess}
      />

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
        <div className="flex-1 overflow-y-auto">
          <div className="container max-w-3xl mx-auto py-12 px-4 md:px-8">
            <div className="flex flex-col justify-center min-h-full pb-24">
              <FormElement
                element={currentElement}
                value={responses[currentElement.id]}
                onChange={handleValueChange}
              />
            </div>
          </div>
        </div>

        {showNavigationButtons && (
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-3xl mx-auto px-4 md:px-8">
              <div className="flex items-center py-4 gap-4">
                {currentElementIndex > 0 && (
                  <>
                    {/* Mobile back button */}
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handlePrevious}
                      className="md:hidden"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    {/* Desktop back button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrevious}
                      className="hidden md:inline-flex"
                    >
                      Press ↑ for previous
                    </Button>
                  </>
                )}

                {!isLastElement ? (
                  <Button
                    className="flex-1 md:flex-none md:ml-auto"
                    onClick={handleNext}
                    size="lg"
                  >
                    {isMobile ? "OK" : "Press Enter ↵"}
                  </Button>
                ) : (
                  <Button
                    className="ml-auto"
                    onClick={handleSubmit}
                    size="lg"
                    disabled={isRewardPending}
                  >
                    {isRewardPending ? "Sending Reward..." : "Submit"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

"use client";

import { Form, FormElementType, FormElementValue } from "@/types/form";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTokenGate } from "@/app/hooks/use-token-gate";
import { useFormRewards } from "@/app/hooks/use-form-rewards";
import { useChainId, useConnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { TokenGateCheck } from "./TokenGateCheck";
import { baseSepolia } from "viem/chains";
import { FormContent } from "./FormContent";

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
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [height, setHeight] = useState("100vh");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();
  const { connect } = useConnect();
  const { hasAccess, isConnected, address } = useTokenGate(
    form.settings.web3?.tokenGating
  );
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const { claimReward, isReady } = useFormRewards({
    rewards: form.settings.web3?.rewards || { enabled: false, chainId: 1 },
    formId: form.id,
    responseId: submissionId || 0,
  });

  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isRewardPending, setIsRewardPending] = useState(false);

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

  useEffect(() => {
    // Focus the element when validation error occurs
    if (Object.keys(validationErrors).length > 0 && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [validationErrors]);

  const totalElements = form.elements.length;
  const currentElement = form.elements[currentElementIndex];
  const isLastElement = currentElementIndex === form.elements.length - 1;

  // Function to validate the current element with error messages
  const validateCurrentElement = (): boolean => {
    // If currentElement is undefined, return false
    if (!currentElement) return false;

    // Clear any existing validation errors for this element
    setValidationErrors((prev) => {
      const updated = { ...prev };
      delete updated[currentElement.id];
      return updated;
    });

    // Check if the element is required and has no response
    if (currentElement.required && !responses[currentElement.id]) {
      // Use more conversational and specific error messages based on element type
      let errorMessage = "Please fill in this field";

      switch (currentElement.type) {
        case FormElementType.EMAIL:
          errorMessage = "Please enter your email";
          break;
        case FormElementType.PHONE:
          errorMessage = "Please enter your phone number";
          break;
        case FormElementType.SHORT_TEXT:
        case FormElementType.LONG_TEXT:
          errorMessage = "Please provide an answer";
          break;
        case FormElementType.MULTIPLE_CHOICE:
          errorMessage = "Please select an option";
          break;
        case FormElementType.DROPDOWN:
          errorMessage = "Please choose an option";
          break;
        case FormElementType.DATE:
          errorMessage = "Please select a date";
          break;
        case FormElementType.FILE_UPLOAD:
          errorMessage = "Please upload a file";
          break;
        case FormElementType.CONTACT_INFO:
          errorMessage = "Please complete your contact information";
          break;
        default:
          errorMessage = "This field is required";
      }

      setValidationErrors((prev) => ({
        ...prev,
        [currentElement.id]: errorMessage,
      }));

      return false;
    }

    return true;
  };

  const handleNext = () => {
    // If we're at the last element, handle submission instead of navigation
    if (isLastElement) {
      handleSubmit();
      return;
    }

    // If not required or has a response, proceed
    if (!currentElement.required || responses[currentElement.id]) {
      setCurrentElementIndex((prev) => prev + 1);
      return;
    }

    // Validate the current element
    if (!validateCurrentElement()) {
      return; // Stop if validation fails
    }

    setCurrentElementIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    // Ensure we don't go below index 0
    if (currentElementIndex > 0) {
      setCurrentElementIndex((prev) => prev - 1);
    }
  };

  const showRewardSuccess = Boolean(
    form.settings.web3?.enabled && form.settings.web3.rewards.enabled
  );

  const handleSubmit = async () => {
    if (isPreview) {
      toast({
        title: "Preview Mode",
        description: "Form submission is disabled in preview mode",
      });
      return;
    }

    // Validate the current element if it's required
    if (!validateCurrentElement()) {
      return;
    }

    // Get the most up-to-date responses including the last question
    const currentResponses = { ...responses };

    // Connect wallet if needed for rewards
    if (
      form.settings.web3?.enabled &&
      form.settings.web3.rewards.enabled &&
      !isConnected
    ) {
      connect({ connector: injected() });
      return;
    }

    // Check chain if web3 is enabled
    if (form.settings.web3?.enabled && chainId !== baseSepolia.id) {
      try {
        switchChain({ chainId: baseSepolia.id });
        return; // Return early as switchChain will trigger a re-render
      } catch {
        toast({
          title: "Network Error",
          description: "Please switch to Base Sepolia to submit this form",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/forms/${form.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responses: currentResponses,
          walletAddress: address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const data = await response.json();
      setSubmissionId(data.id);

      setIsSuccess(true);

      // If rewards are enabled and we have a submission ID, claim the reward
      if (
        form.settings.web3?.enabled &&
        form.settings.web3.rewards.enabled &&
        data.id &&
        isReady
      ) {
        setIsRewardPending(true);
        try {
          await claimReward();
          toast({
            title: "Success",
            description: "Form submitted and reward claimed!",
          });
        } catch (error) {
          console.error("Failed to claim reward:", error);
          // Don't set isSuccess to false, as the form submission was still successful
          toast({
            title: "Warning",
            description:
              "Form submitted but failed to claim reward. You can try claiming later.",
            variant: "destructive",
          });
        } finally {
          setIsRewardPending(false);
        }
      }

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLastElement) {
      handleNext();
    } else if (e.key === "ArrowUp" && currentElementIndex > 0) {
      handlePrevious();
    }
  };

  const handleValueChange = (value: FormElementValue) => {
    // Clear validation error when user provides a value
    if (validationErrors[currentElement.id]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[currentElement.id];
        return updated;
      });
    }

    // Store the response immediately
    const updatedResponses = {
      ...responses,
      [currentElement.id]: value,
    };

    // Update the responses state
    setResponses(updatedResponses);

    // Auto-advance for Welcome Screen and single-choice selection
    if (
      currentElement.type === FormElementType.WELCOME_SCREEN ||
      (currentElement.type === FormElementType.MULTIPLE_CHOICE &&
        !currentElement.properties.allowMultiple)
    ) {
      // Don't auto-navigate or submit on the last element for multiple choice
      if (
        isLastElement &&
        currentElement.type === FormElementType.MULTIPLE_CHOICE
      ) {
        return;
      }

      // Use setTimeout to ensure the state update happens before navigation
      setTimeout(() => {
        if (!isLastElement) {
          handleNext();
        }
      }, 50);
    }
  };

  // Safety check - if currentElement is undefined, show a fallback
  if (!currentElement) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Error loading form content. Please refresh the page.</p>
      </div>
    );
  }

  const formContent = (
    <div ref={formRef}>
      <FormContent
        form={form}
        isPreview={isPreview}
        className={className}
        currentElementIndex={currentElementIndex}
        totalElements={totalElements}
        currentElement={currentElement}
        responses={responses}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        isRewardPending={isRewardPending}
        showRewardSuccess={showRewardSuccess}
        height={height}
        isMobile={isMobile}
        chainId={chainId}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
        handleValueChange={handleValueChange}
        validationErrors={validationErrors}
      />
    </div>
  );

  // Show token gate check if access is not granted
  if (
    form.settings.web3?.enabled &&
    form.settings.web3.tokenGating.enabled &&
    !hasAccess
  ) {
    return (
      <TokenGateCheck
        isConnected={isConnected}
        minTokenBalance={form.settings.web3.tokenGating.minTokenBalance || 0}
        contractAddress={form.settings.web3.tokenGating.contractAddress || ""}
      />
    );
  }

  // Show form content if access is granted or no token gating
  return formContent;
}

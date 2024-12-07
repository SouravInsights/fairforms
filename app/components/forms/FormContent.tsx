import { Progress } from "@/components/ui/progress";
import { FormElement as FormElementComponent } from "./elements";
import {
  Form,
  FormElementType,
  FormElementValue,
  FormElement,
} from "@/types/form";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FormNavigationButtons } from "./FormNavigationButtons";
import { FormSubmissionFeedback } from "./FormSubmissionFeedback";
import { FormLoadingState } from "./FormLoadingState";

interface FormContentProps {
  form: Form;
  isPreview?: boolean;
  className?: string;
  currentElementIndex: number;
  totalElements: number;
  currentElement: FormElement;
  responses: Record<string, FormElementValue>;
  isSubmitting: boolean;
  isSuccess: boolean;
  isRewardPending: boolean;
  showRewardSuccess: boolean;
  height: string;
  isMobile: boolean;
  chainId: number;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubmit: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleValueChange: (value: FormElementValue) => void;
}

export function FormContent({
  form,
  isPreview,
  className,
  currentElementIndex,
  totalElements,
  currentElement,
  responses,
  isSubmitting,
  isSuccess,
  isRewardPending,
  showRewardSuccess,
  height,
  isMobile,
  chainId,
  handleNext,
  handlePrevious,
  handleSubmit,
  handleKeyDown,
  handleValueChange,
}: FormContentProps) {
  const progress = (currentElementIndex / totalElements) * 100;
  const isLastElement = currentElementIndex === totalElements - 1;
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

      <FormLoadingState
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        isRewardPending={isRewardPending}
        showRewardSuccess={showRewardSuccess}
      />

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
              <FormElementComponent
                element={currentElement}
                value={responses[currentElement.id]}
                onChange={handleValueChange}
              />
            </div>
          </div>
        </div>

        {showNavigationButtons && (
          <FormNavigationButtons
            currentElementIndex={currentElementIndex}
            isLastElement={isLastElement}
            isMobile={isMobile}
            isSubmitting={isSubmitting}
            isRewardPending={isRewardPending}
            chainId={chainId}
            form={form}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
          />
        )}
      </motion.div>
    </div>
  );
}

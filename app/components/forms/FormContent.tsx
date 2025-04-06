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
import { LogoIcon } from "../icons";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

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
  validationErrors?: Record<string, string>;
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
  validationErrors = {},
}: FormContentProps) {
  const progress = (currentElementIndex / totalElements) * 100;
  const isLastElement = currentElementIndex === totalElements - 1;
  // Add safe checks for currentElement
  const showNavigationButtons =
    currentElement &&
    currentElement.type !== FormElementType.WELCOME_SCREEN &&
    currentElement.type !== FormElementType.END_SCREEN;

  // Check if the current element has a validation error
  const hasError = currentElement && !!validationErrors[currentElement.id];
  return (
    <div
      className={cn(
        "bg-background",
        className,
        isPreview ? "min-h-[400px]" : ""
      )}
      style={{
        height: isPreview ? "400px" : height,
        backgroundColor: form.settings.theme.backgroundColor,
      }}
    >
      {form.settings.behavior.showProgressBar && (
        <Progress
          value={progress}
          className="fixed top-0 left-0 right-0 h-1 z-50"
          indicatorColor={form.settings.theme.primaryColor}
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
        <div className="flex h-full flex-col md:flex-row">
          {/* Sidebar */}
          <div
            className="flex flex-col w-full md:w-[400px] justify-between p-6"
            style={{ backgroundColor: form.settings.theme.sidebarColor }}
          >
            {/* Header */}
            <div className="justify-center content-center h-[80%]">
              {/*<div className="pb-4">
                <LogoIcon width={120} height={20} />
              </div>*/}
              <div>
                <h1
                  className="text-2xl font-medium mb-1 flex items-center gap-2 "
                  style={{ color: form.settings.theme.questionColor }}
                >
                  {form.title}
                </h1>
                <p
                  className="text-base font-normal "
                  style={{ color: form.settings.theme.textColor }}
                >
                  Please take a moment to fill out this form.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div
              className="hidden md:flex items-center"
              style={{ color: form.settings.theme.textColor }}
            >
              <p className="text-base font-normal pr-3">Created with</p>
              <Link href="https://www.fairforms.xyz/" target="_blank">
                <LogoIcon width={120} height={20} theme={form.settings.theme} />
              </Link>
            </div>
          </div>

          {/* Main Form Content */}
          <div
            className="flex-1 flex flex-col justify-center"
            style={{ backgroundColor: form.settings.theme.backgroundColor }}
          >
            <div className="content-center overflow-y-auto">
              <div className="container max-w-lg mx-auto py-12 px-4 md:px-8">
                <div className="flex flex-col justify-center min-h-full pb-10">
                  <FormElementComponent
                    element={currentElement}
                    value={responses[currentElement.id]}
                    onChange={handleValueChange}
                    theme={form.settings.theme}
                    hasError={hasError}
                  />

                  {/* Validation Error Message */}
                  {hasError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-red-500 flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>{validationErrors[currentElement.id]}</span>
                    </motion.div>
                  )}
                </div>

                {/*Navigation Buttons*/}
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
                    theme={form.settings.theme}
                    hasError={hasError}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex md:hidden justify-center py-5">
            <p
              className="text-base font-normal pr-3"
              style={{ color: form.settings.theme.textColor }}
            >
              Created with
            </p>
            <Link href="https://www.fairforms.xyz/" target="_blank">
              <LogoIcon width={120} height={20} theme={form.settings.theme} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

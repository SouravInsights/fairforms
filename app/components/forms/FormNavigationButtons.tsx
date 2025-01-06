import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Form } from "@/types/form";
import { baseSepolia } from "viem/chains";
import { cn } from "@/lib/utils";

interface FormNavigationButtonsProps {
  currentElementIndex: number;
  isLastElement: boolean;
  isMobile: boolean;
  isSubmitting: boolean;
  isRewardPending: boolean;
  chainId: number;
  form: Form;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  theme: Form["settings"]["theme"];
}

export function FormNavigationButtons({
  currentElementIndex,
  isLastElement,
  isMobile,
  isSubmitting,
  isRewardPending,
  chainId,
  form,
  onNext,
  onPrevious,
  onSubmit,
  theme,
}: FormNavigationButtonsProps) {
  // Custom button styles based on theme
  const primaryButtonStyles = {
    backgroundColor: theme.primaryColor,
    color: theme.backgroundColor,
    "&:hover": {
      backgroundColor: `${theme.primaryColor}E6`, // 90% opacity
    },
    "&:focus": {
      outline: "none",
      boxShadow: `0 0 0 2px ${theme.primaryColor}33`,
    },
  };

  const outlineButtonStyles = {
    backgroundColor: "transparent",
    color: theme.questionColor,
    borderColor: `${theme.primaryColor}33`,
    "&:hover": {
      backgroundColor: `${theme.primaryColor}11`,
      borderColor: theme.primaryColor,
    },
  };

  const ghostButtonStyles = {
    backgroundColor: "transparent",
    color: theme.textColor,
    "&:hover": {
      backgroundColor: `${theme.primaryColor}11`,
      color: theme.questionColor,
    },
  };

  return (
    <div className="flex items-center py-2 gap-4 form-themed">
      {currentElementIndex > 0 && (
        <>
          {/* Mobile back button */}
          <Button
            variant="outline"
            size="lg"
            onClick={onPrevious}
            className={"md:hidden"}
            style={outlineButtonStyles}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Desktop back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            className="hidden md:inline-flex"
            style={ghostButtonStyles}
          >
            Press ↑ for previous
          </Button>
        </>
      )}

      {!isLastElement ? (
        <Button
          className="flex-1 md:flex-none md:ml-auto"
          style={primaryButtonStyles}
          onClick={onNext}
          size="lg"
        >
          {isMobile ? "OK" : "Press Enter ↵"}
        </Button>
      ) : (
        <Button
          className={cn(
            "ml-auto",
            (isSubmitting || isRewardPending) && "opacity-70"
          )}
          style={{
            ...primaryButtonStyles,
            ...(isSubmitting || isRewardPending
              ? {
                  backgroundColor: `${theme.primaryColor}99`,
                }
              : {}),
          }}
          onClick={onSubmit}
          size="lg"
          disabled={isSubmitting || isRewardPending}
        >
          {isRewardPending
            ? "Processing Reward..."
            : isSubmitting
              ? "Submitting..."
              : chainId !== baseSepolia.id &&
                  form.settings.web3?.rewards.enabled
                ? "Switch Network & Submit"
                : "Submit"}
        </Button>
      )}
    </div>
  );
}

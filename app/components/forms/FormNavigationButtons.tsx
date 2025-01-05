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
  const primaryButtonClass = cn(
    "transition-colors duration-200",
    "hover:opacity-90 disabled:opacity-50"
  );

  const outlineButtonClass = cn(
    "transition-colors duration-200",
    "hover:bg-opacity-10 border"
  );

  return (
    <div className="flex items-center py-2 gap-4 form-themed">
      {currentElementIndex > 0 && (
        <>
          {/* Mobile back button */}
          <Button
            variant="outline"
            size="lg"
            onClick={onPrevious}
            className={cn("md:hidden", outlineButtonClass)}
            style={{
              borderColor: theme.primaryColor + "33",
              color: theme.questionColor,
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Desktop back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            className="hidden md:inline-flex"
            style={{ color: theme.textColor }}
          >
            Press ↑ for previous
          </Button>
        </>
      )}

      {!isLastElement ? (
        <Button
          className={cn("flex-1 md:flex-none md:ml-auto", primaryButtonClass)}
          style={{
            backgroundColor: theme.primaryColor,
            color: theme.backgroundColor,
          }}
          onClick={onNext}
          size="lg"
        >
          {isMobile ? "OK" : "Press Enter ↵"}
        </Button>
      ) : (
        <Button
          className={cn("ml-auto", primaryButtonClass)}
          style={{
            backgroundColor: theme.primaryColor,
            color: theme.backgroundColor,
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

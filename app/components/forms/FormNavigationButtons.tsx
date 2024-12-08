import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Form } from "@/types/form";
import { baseSepolia } from "viem/chains";

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
}: FormNavigationButtonsProps) {
  return (
    <div className="flex items-center py-2 gap-4">
      {currentElementIndex > 0 && (
        <>
          {/* Mobile back button */}
          <Button
            variant="outline"
            size="lg"
            onClick={onPrevious}
            className="md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Desktop back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            className="hidden md:inline-flex"
          >
            Press ↑ for previous
          </Button>
        </>
      )}

      {!isLastElement ? (
        <Button
          className="flex-1 md:flex-none md:ml-auto"
          onClick={onNext}
          size="lg"
        >
          {isMobile ? "OK" : "Press Enter ↵"}
        </Button>
      ) : (
        <Button
          className="ml-auto"
          onClick={onSubmit}
          size="lg"
          disabled={isSubmitting || isRewardPending}
        >
          {isRewardPending
            ? "Processing Reward..."
            : isSubmitting
            ? "Submitting..."
            : chainId !== baseSepolia.id && form.settings.web3?.rewards.enabled
            ? "Switch Network & Submit"
            : "Submit"}
        </Button>
      )}
    </div>
  );
}

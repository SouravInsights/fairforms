import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Form } from "@/types/form";
import { cn } from "@/lib/utils";

interface FormNavigationButtonsProps {
  currentElementIndex: number;
  isLastElement: boolean;
  isMobile: boolean;
  isSubmitting: boolean;
  form: Form;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  theme: Form["settings"]["theme"];
  hasError?: boolean;
}

export function FormNavigationButtons({
  currentElementIndex,
  isLastElement,
  isMobile,
  isSubmitting,
  onNext,
  onPrevious,
  onSubmit,
  theme,
  hasError = false, // Default to false
}: FormNavigationButtonsProps) {
  // Custom button styles based on theme
  // const primaryButtonStyles = {
  //   backgroundColor: theme.primaryColor,
  //   color: theme.backgroundColor,
  //   "&:hover": {
  //     backgroundColor: `${theme.primaryColor}E6`, // 90% opacity
  //   },
  //   "&:focus": {
  //     outline: "none",
  //     boxShadow: `0 0 0 2px ${theme.primaryColor}33`,
  //   },
  // };

  const errorButtonStyles = {
    backgroundColor: hasError ? "#f87171" : theme.primaryColor, // Light red for error state
    color: theme.backgroundColor,
    "&:hover": {
      backgroundColor: hasError ? "#ef4444" : `${theme.primaryColor}E6`, // Darker red on hover
    },
    "&:focus": {
      outline: "none",
      boxShadow: `0 0 0 2px ${hasError ? "#fca5a5" : theme.primaryColor}33`, // Light red shadow
    },
    cursor: hasError ? "not-allowed" : "pointer",
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

  // Function to handle next button click with validation feedback
  const handleNextClick = () => {
    if (hasError) {
      // Do nothing or shake animation if there's an error
      const buttonElement = document.getElementById("next-button");
      if (buttonElement) {
        buttonElement.classList.add("animate-shake");
        setTimeout(() => {
          buttonElement.classList.remove("animate-shake");
        }, 500);
      }
      return;
    }
    onNext();
  };

  // Function to handle submit button click with validation feedback
  const handleSubmitClick = () => {
    if (hasError) {
      // Do nothing or shake animation if there's an error
      const buttonElement = document.getElementById("submit-button");
      if (buttonElement) {
        buttonElement.classList.add("animate-shake");
        setTimeout(() => {
          buttonElement.classList.remove("animate-shake");
        }, 500);
      }
      return;
    }
    onSubmit();
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
          id="next-button"
          className={cn(
            "flex-1 md:flex-none md:ml-auto",
            hasError && "animate-pulse"
          )}
          style={errorButtonStyles}
          onClick={handleNextClick}
          size="lg"
        >
          {isMobile ? "OK" : "Press Enter ↵"}
        </Button>
      ) : (
        <Button
          id="submit-button"
          className={cn(
            "ml-auto",
            isSubmitting && "opacity-70",
            hasError && "animate-pulse"
          )}
          style={{
            ...errorButtonStyles,
            ...(isSubmitting
              ? {
                  backgroundColor: `${theme.primaryColor}99`,
                }
              : {}),
          }}
          onClick={handleSubmitClick}
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Submitting..."
            : hasError
              ? "Please Fill Required Field"
              : "Submit"}
        </Button>
      )}
    </div>
  );
}

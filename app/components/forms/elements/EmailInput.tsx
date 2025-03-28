import {
  EmailProperties,
  Form,
  FormElement,
  FormElementType,
} from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";

// Default theme values
const defaultTheme = {
  questionColor: "#000000",
  textColor: "#4B5563",
  primaryColor: "#2563EB",
  backgroundColor: "#FFFFFF",
};

interface EmailInputProps {
  element: FormElement;
  value: string;
  onChange: (value: string) => void;
  theme?: Partial<Form["settings"]["theme"]>;
  hasError?: boolean;
  validationErrors?: Record<string, string>;
}

function isEmailElement(element: FormElement): element is FormElement & {
  type: FormElementType.EMAIL;
  properties: EmailProperties;
} {
  return element.type === FormElementType.EMAIL;
}

// Default email validation
const defaultEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function EmailInput({
  element,
  value,
  onChange,
  theme = {},
  hasError = false,
  validationErrors = {},
}: EmailInputProps) {
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Merge default theme with provided theme
  const currentTheme = { ...defaultTheme, ...theme };

  const validateEmail = (email: string) => {
    if (!email && element.required) {
      return "Please enter your email";
    }

    const emailRegex = defaultEmailRegex;

    if (email && !email.match(emailRegex)) {
      return "Please enter a valid email address";
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Only set internal error for format validation, not for required field
    const validationError = newValue ? validateEmail(newValue) : null;
    setInternalError(validationError);
    setIsValid(!validationError && newValue.length > 0);
  };

  // Handle blur for validation
  const handleBlur = () => {
    setIsFocused(false);
    if (value) {
      // Only validate format on blur, not "required" state
      const formatError = validateEmail(value);
      if (formatError && formatError !== "Please enter your email") {
        setInternalError(formatError);
      }
    }
  };

  // Check if we should show an error - only use internal errors or validation from form
  const externalError = validationErrors[element.id];
  const hasAnyError = hasError || !!internalError || !!externalError;
  // Prioritize internal format errors over external required field errors
  const errorToShow = internalError || externalError;

  if (!isEmailElement(element)) {
    return null;
  }

  return (
    <div className="space-y-8">
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Label
          className="text-xl md:text-2xl font-medium leading-tight"
          style={{ color: currentTheme.questionColor }}
        >
          {element.question}
          {element.required && (
            <span style={{ color: currentTheme.primaryColor }} className="ml-1">
              *
            </span>
          )}
        </Label>
        {element.description && (
          <motion.p
            className="text-base sm:text-lg"
            style={{ color: currentTheme.textColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {element.description}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="relative"
      >
        <div className="relative">
          <Input
            type="email"
            value={value || ""}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder={element.properties.placeholder}
            className={cn(
              "transition-all duration-200",
              isFocused && "ring-2",
              hasAnyError && "border-red-500 pr-10",
              isValid && !hasAnyError && "border-green-500 pr-10",
              "placeholder:opacity-50",
              hasError && !internalError && "animate-highlight"
            )}
            style={{
              borderColor: hasAnyError
                ? "#ef4444"
                : isFocused
                  ? theme.primaryColor
                  : isValid
                    ? "#10b981"
                    : `${theme.questionColor}33`,
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
            }}
            aria-invalid={hasAnyError}
            aria-errormessage={hasAnyError ? "email-error" : undefined}
          />

          {/* Status Icons */}
          {hasAnyError && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}

          {isValid && !hasAnyError && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
              <CheckCircle className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Only show error message if we have an error */}
        {errorToShow && (
          <motion.p
            id="email-error"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm mt-2 text-red-500 flex items-center"
          >
            <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{errorToShow}</span>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

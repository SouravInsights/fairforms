import { Form, FormElement, FormElementType } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";

function isTextInputElement(element: FormElement): element is FormElement & {
  type: FormElementType.SHORT_TEXT | FormElementType.LONG_TEXT;
  properties: {
    placeholder: string;
    minLength?: number;
    maxLength?: number;
    richText: boolean;
  };
} {
  return (
    element.type === FormElementType.SHORT_TEXT ||
    element.type === FormElementType.LONG_TEXT
  );
}

interface TextInputProps {
  element: FormElement;
  value: string;
  onChange: (value: string) => void;
  theme: Form["settings"]["theme"];
  hasError?: boolean;
  validationErrors?: Record<string, string>;
}

export function TextInput({
  element,
  value,
  onChange,
  theme,
  hasError = false,
  validationErrors = {},
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);

  if (!isTextInputElement(element)) {
    return null;
  }

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Set valid state if we have a value
    setIsValid(newValue.trim().length > 0);
  };

  // Check if we should show an error
  const externalError = validationErrors[element.id];
  const hasAnyError = hasError || !!externalError;
  const errorToShow = externalError;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <motion.h2
          className="text-xl md:text-2xl font-medium leading-tight"
          style={{ color: theme.questionColor }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {element.question}
          {element.required && (
            <span style={{ color: theme.primaryColor }} className="ml-1">
              *
            </span>
          )}
        </motion.h2>

        {element.description && (
          <motion.p
            style={{ color: theme.textColor }}
            className="text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {element.description}
          </motion.p>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {element.type === FormElementType.LONG_TEXT ? (
          <div className="relative">
            <Textarea
              value={value || ""}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={element.properties.placeholder}
              minLength={element.properties.minLength}
              maxLength={element.properties.maxLength}
              className={cn(
                "text-lg min-h-[150px] resize-none transition-all duration-200",
                isFocused && "ring-2",
                hasAnyError && "border-red-500 pr-10",
                isValid && !hasAnyError && "border-green-500",
                "placeholder:opacity-50",
                hasError && "animate-highlight"
              )}
              style={{
                backgroundColor: theme.backgroundColor,
                color: theme.questionColor,
                borderColor: hasAnyError
                  ? "#ef4444"
                  : isFocused
                    ? theme.primaryColor
                    : isValid
                      ? "#10b981"
                      : `${theme.primaryColor}33`,
              }}
              aria-invalid={hasAnyError}
              aria-errormessage={
                hasAnyError ? `text-error-${element.id}` : undefined
              }
            />
          </div>
        ) : (
          <div className="relative">
            <Input
              type="text"
              value={value || ""}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={element.properties.placeholder}
              minLength={element.properties.minLength}
              maxLength={element.properties.maxLength}
              className={cn(
                "text-lg h-14 transition-all duration-200",
                isFocused && "ring-2",
                hasAnyError && "border-red-500 pr-10",
                isValid && !hasAnyError && "border-green-500 pr-10",
                "placeholder:opacity-50",
                hasError && "animate-highlight"
              )}
              style={{
                backgroundColor: theme.backgroundColor,
                color: theme.questionColor,
                borderColor: hasAnyError
                  ? "#ef4444"
                  : isFocused
                    ? theme.primaryColor
                    : isValid
                      ? "#10b981"
                      : `${theme.primaryColor}33`,
              }}
              aria-invalid={hasAnyError}
              aria-errormessage={
                hasAnyError ? `text-error-${element.id}` : undefined
              }
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
        )}

        {/* Character counter */}
        {element.properties.maxLength && (
          <motion.p
            className="mt-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {value?.length || 0} / {element.properties.maxLength} characters
          </motion.p>
        )}

        {/* Error message */}
        {errorToShow && (
          <motion.p
            id={`text-error-${element.id}`}
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

import { Form, FormElement, FormElementType } from "@/types/form";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

function isTextAreaElement(element: FormElement): element is FormElement & {
  type: FormElementType.LONG_TEXT;
  properties: {
    placeholder: string;
    minLength?: number;
    maxLength?: number;
    richText: boolean;
  };
} {
  return element.type === FormElementType.LONG_TEXT;
}

interface TextAreaProps {
  element: FormElement;
  value: string;
  onChange: (value: string) => void;
  theme: Form["settings"]["theme"];
  hasError?: boolean;
  validationErrors?: Record<string, string>;
}

export function TextArea({
  element,
  value,
  onChange,
  theme,
  hasError = false,
  validationErrors = {},
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);

  if (!isTextAreaElement(element)) {
    return null;
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
            className="text-lg"
            style={{ color: theme.textColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {element.description}
          </motion.p>
        )}
      </div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <textarea
            className={cn(
              "w-full min-h-[200px] rounded-lg p-4 text-lg resize-none transition-all duration-200",
              isFocused && "ring-2",
              hasAnyError && "border-red-500",
              isValid && !hasAnyError && "border-green-500",
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
            value={value || ""}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={element.properties.placeholder}
            minLength={element.properties.minLength}
            maxLength={element.properties.maxLength}
            aria-invalid={hasAnyError}
            aria-errormessage={
              hasAnyError ? `textarea-error-${element.id}` : undefined
            }
          />
        </div>

        {/* Character counter */}
        {(element.properties.minLength || element.properties.maxLength) && (
          <motion.p
            className={cn("text-sm text-right", hasAnyError && "text-red-500")}
            style={{ color: hasAnyError ? "#ef4444" : theme.textColor + "CC" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {value?.length || 0}
            {element.properties.maxLength &&
              ` / ${element.properties.maxLength}`}{" "}
            characters
          </motion.p>
        )}

        {/* Error message */}
        {errorToShow && (
          <motion.p
            id={`textarea-error-${element.id}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 flex items-center"
          >
            <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{errorToShow}</span>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

import { FormElement, FormElementType } from "@/types/form";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

function isMultipleChoiceElement(
  element: FormElement
): element is FormElement & {
  type: FormElementType.MULTIPLE_CHOICE;
  properties: {
    options: Array<{
      id: string;
      text: string;
      imageUrl?: string;
    }>;
    allowMultiple: boolean;
    randomizeOrder: boolean;
    allowOther: boolean;
  };
} {
  return element.type === FormElementType.MULTIPLE_CHOICE;
}

interface MultipleChoiceInputProps {
  element: FormElement;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

export function MultipleChoiceInput({
  element,
  value,
  onChange,
}: MultipleChoiceInputProps) {
  if (!isMultipleChoiceElement(element)) {
    return null;
  }

  const handleOptionClick = (optionId: string) => {
    if (element.properties.allowMultiple) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(optionId)
        ? currentValue.filter((id) => id !== optionId)
        : [...currentValue, optionId];
      onChange(newValue);
    } else {
      onChange(optionId);
    }
  };

  const isSelected = (optionId: string) => {
    if (element.properties.allowMultiple) {
      return Array.isArray(value) && value.includes(optionId);
    }
    return value === optionId;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <motion.h2
          className="text-3xl font-medium leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {element.question}
          {element.required && <span className="text-primary ml-1">*</span>}
        </motion.h2>

        {element.description && (
          <motion.p
            className="text-base sm:text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {element.description}
          </motion.p>
        )}
      </div>

      <div className="space-y-2 sm:space-y-3 px-1 -mx-1">
        {element.properties.options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="touch-none"
          >
            <button
              onClick={() => handleOptionClick(option.id)}
              className={cn(
                "w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all",
                "hover:border-primary/50 active:scale-[0.98]",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected(option.id)
                  ? "border-primary bg-primary/5"
                  : "border-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex-shrink-0",
                    "transition-colors duration-200",
                    isSelected(option.id)
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  {isSelected(option.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full rounded-full bg-white scale-[0.4]"
                    />
                  )}
                </div>
                <span className="text-base sm:text-lg">{option.text}</span>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Show hint for multiple selection if enabled */}
      {element.properties.allowMultiple && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground"
        >
          You can select multiple options
        </motion.p>
      )}
    </div>
  );
}

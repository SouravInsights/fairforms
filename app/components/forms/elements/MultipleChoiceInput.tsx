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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <motion.h2
          className="text-3xl font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {element.question}
          {element.required && <span className="text-primary ml-1">*</span>}
        </motion.h2>

        {element.description && (
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {element.description}
          </motion.p>
        )}
      </div>

      <div className="space-y-3 mt-8">
        {element.properties.options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => onChange(option.id)}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all",
                "hover:border-primary/50",
                value === option.id
                  ? "border-primary bg-primary/5"
                  : "border-muted"
              )}
            >
              <span className="text-lg">{option.text}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

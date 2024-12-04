import { FormElement, FormElementType } from "@/types/form";
import { motion } from "motion/react";

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
}

export function TextArea({ element, value, onChange }: TextAreaProps) {
  if (!isTextAreaElement(element)) {
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

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <textarea
          className="w-full min-h-[200px] rounded-lg border border-input bg-background p-4 text-lg ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={element.properties.placeholder}
          minLength={element.properties.minLength}
          maxLength={element.properties.maxLength}
        />

        {(element.properties.minLength || element.properties.maxLength) && (
          <motion.p
            className="text-sm text-muted-foreground text-right"
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
      </motion.div>
    </div>
  );
}

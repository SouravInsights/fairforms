import { FormElement, FormElementType } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";

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
}

export function TextInput({ element, value, onChange }: TextInputProps) {
  if (!isTextInputElement(element)) {
    return null;
  }

  return (
    <div className="space-y-8">
      <motion.h2
        className="text-3xl font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {element.question}
        {element.required && <span className="text-primary ml-1">*</span>}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {element.type === FormElementType.LONG_TEXT ? (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={element.properties.placeholder}
            minLength={element.properties.minLength}
            maxLength={element.properties.maxLength}
            className="text-lg min-h-[150px] resize-none"
          />
        ) : (
          <Input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={element.properties.placeholder}
            minLength={element.properties.minLength}
            maxLength={element.properties.maxLength}
            className="text-lg h-14"
          />
        )}

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
      </motion.div>
    </div>
  );
}

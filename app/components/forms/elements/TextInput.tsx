import { Form, FormElement, FormElementType } from "@/types/form";
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
  theme: Form["settings"]["theme"];
}

export function TextInput({ element, value, onChange, theme }: TextInputProps) {
  if (!isTextInputElement(element)) {
    return null;
  }

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
            <span
              style={{ color: theme.primaryColor }}
              className="text-primary ml-1"
            >
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
      >
        {element.type === FormElementType.LONG_TEXT ? (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={element.properties.placeholder}
            minLength={element.properties.minLength}
            maxLength={element.properties.maxLength}
            className="text-lg min-h-[150px] resize-none"
            style={{
              backgroundColor: theme.backgroundColor,
              color: theme.questionColor,
              borderColor: `${theme.primaryColor}33`,
            }}
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
            style={{
              backgroundColor: theme.backgroundColor,
              color: theme.questionColor,
              borderColor: `${theme.primaryColor}33`,
            }}
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

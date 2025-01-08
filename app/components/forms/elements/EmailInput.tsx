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
}: EmailInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Merge default theme with provided theme
  const currentTheme = { ...defaultTheme, ...theme };

  const validateEmail = (email: string) => {
    if (!email && element.required) {
      return "Email is required";
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

    const validationError = validateEmail(newValue);
    setError(validationError);
    setIsValid(!validationError && newValue.length > 0);
  };

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
        <Input
          type="email"
          value={value || ""}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={element.properties.placeholder}
          className={cn(
            "transition-all duration-200",
            isFocused && "ring-2",
            error && "border-red-500",
            isValid && "border-green-500",
            "placeholder:opacity-50"
          )}
          style={{
            borderColor: isFocused
              ? theme.primaryColor
              : `${theme.questionColor}33`,
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
          }}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm mt-1 text-red-500"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

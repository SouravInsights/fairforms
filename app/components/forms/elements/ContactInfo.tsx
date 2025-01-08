import {
  Form,
  FormElement,
  FormElementType,
  FormElementValue,
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

type ContactInfoValue = {
  firstName: string;
  lastName: string;
  middleName?: string;
};

interface ContactInfoProps {
  element: FormElement & { type: FormElementType.CONTACT_INFO };
  value: FormElementValue;
  onChange: (value: FormElementValue) => void;
  theme?: Partial<Form["settings"]["theme"]>;
}

export function ContactInfo({
  element,
  value,
  onChange,
  theme = {},
}: ContactInfoProps) {
  const [isFocused, setIsFocused] = useState<string | null>(null);

  // Merge default theme with provided theme
  const currentTheme = { ...defaultTheme, ...theme };

  const contactValue = (value as ContactInfoValue) || {
    firstName: "",
    lastName: "",
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Input
            placeholder={element.properties.placeholders.firstName}
            value={contactValue.firstName}
            onChange={(e) =>
              onChange({
                ...contactValue,
                firstName: e.target.value,
              })
            }
            onFocus={() => setIsFocused("firstName")}
            onBlur={() => setIsFocused(null)}
            style={
              {
                borderColor: isFocused
                  ? theme.primaryColor
                  : `${theme.questionColor}33`,
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                opacity: 1,
                "--input-placeholder-color": `${theme.textColor}99`,
              } as React.CSSProperties
            }
            className={cn(
              "transition-all duration-200",
              "[&::placeholder]:text-[var(--input-placeholder-color)]",
              isFocused && "ring-2"
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Input
            placeholder={element.properties.placeholders.lastName}
            value={contactValue.lastName}
            onChange={(e) =>
              onChange({
                ...contactValue,
                lastName: e.target.value,
              })
            }
            onFocus={() => setIsFocused("lastName")}
            onBlur={() => setIsFocused(null)}
            style={
              {
                borderColor: isFocused
                  ? theme.primaryColor
                  : `${theme.questionColor}33`,
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                opacity: 1,
                "--input-placeholder-color": `${theme.textColor}99`,
              } as React.CSSProperties
            }
            className={cn(
              "transition-all duration-200",
              "[&::placeholder]:text-[var(--input-placeholder-color)]",
              isFocused && "ring-2"
            )}
          />
        </motion.div>

        {element.properties.showMiddleName && (
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Input
              placeholder="Middle Name"
              value={contactValue.middleName || ""}
              onChange={(e) =>
                onChange({
                  ...contactValue,
                  middleName: e.target.value,
                })
              }
              onFocus={() => setIsFocused("middleName")}
              onBlur={() => setIsFocused(null)}
              className={cn(
                "transition-all duration-200",
                isFocused === "middleName" && "ring-2"
              )}
              style={{
                borderColor:
                  isFocused === "middleName"
                    ? currentTheme.primaryColor
                    : undefined,
                backgroundColor: `${currentTheme.primaryColor}10`,
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

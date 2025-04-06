import {
  FormElement,
  FormElementType,
  Form,
  PhoneProperties,
} from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Country code validation patterns
const phoneValidationRules: Record<
  string,
  { pattern: RegExp; example: string }
> = {
  "+1": { pattern: /^\d{10}$/, example: "10 digits (e.g., 5551234567)" },
  "+44": { pattern: /^\d{10,11}$/, example: "10-11 digits (e.g., 7911123456)" },
  "+91": { pattern: /^\d{10}$/, example: "10 digits (e.g., 9876543210)" },
  "+33": { pattern: /^\d{9}$/, example: "9 digits (e.g., 612345678)" },
  "+49": { pattern: /^\d{10,11}$/, example: "10-11 digits (e.g., 1701234567)" },
  "+81": { pattern: /^\d{10,11}$/, example: "10-11 digits (e.g., 9012345678)" },
  "+86": { pattern: /^\d{11}$/, example: "11 digits (e.g., 13912345678)" },
  default: { pattern: /^\d{6,15}$/, example: "6-15 digits" },
};

function isPhoneElement(element: FormElement): element is FormElement & {
  type: FormElementType.PHONE;
  properties: PhoneProperties;
} {
  return element.type === FormElementType.PHONE;
}

interface PhoneInputProps {
  element: FormElement;
  value?: { countryCode: string; number: string };
  onChange: (value: { countryCode: string; number: string }) => void;
  theme?: Partial<Form["settings"]["theme"]>;
  hasError?: boolean;
  validationErrors?: Record<string, string>;
}

export function PhoneInput({
  element,
  value = { countryCode: "", number: "" },
  onChange,
  theme = {},
  hasError = false,
  validationErrors = {},
}: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  // Merge default theme with provided theme
  const currentTheme = { ...defaultTheme, ...theme };

  // Make sure the element is a phone element before accessing its properties
  if (!isPhoneElement(element)) {
    return null;
  }

  // Get the current country code or use the default from element properties
  const currentCountryCode =
    value?.countryCode || element.properties.defaultCountry;

  // Get validation rules for the current country code
  const validationRule =
    phoneValidationRules[currentCountryCode] || phoneValidationRules.default;

  // Validate phone number based on country-specific rules
  const validatePhone = (phoneNumber: string, countryCode: string) => {
    if (!phoneNumber && element.required) {
      return "Please enter your phone number";
    }

    // Skip further validation if empty and not required
    if (!phoneNumber && !element.required) {
      return null;
    }

    // Get country-specific validation rule
    const rule =
      phoneValidationRules[countryCode as keyof typeof phoneValidationRules] ||
      phoneValidationRules.default;

    if (!rule.pattern.test(phoneNumber)) {
      return `Invalid phone number format. Expected ${rule.example}`;
    }

    return null;
  };

  // Handle input change with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers (no "+" in the number field)
    onChange({ ...value, number: sanitizedValue });

    // Only set internal error for format validation, not for required field
    const validationError = sanitizedValue
      ? validatePhone(sanitizedValue, currentCountryCode)
      : null;
    setInternalError(validationError);
    setIsValid(!validationError && sanitizedValue.length > 0);
  };

  // Handle blur for validation
  const handleBlur = () => {
    setIsFocused(false);
    if (value.number) {
      // Only validate format on blur, not "required" state
      const formatError = validatePhone(value.number, currentCountryCode);
      if (formatError && formatError !== "Please enter your phone number") {
        setInternalError(formatError);
      }
    }
  };

  // Handle country code change
  const handleCountryChange = (countryCode: string) => {
    onChange({ ...value, countryCode });

    // Revalidate number when country changes
    if (value.number) {
      const validationError = validatePhone(value.number, countryCode);
      setInternalError(validationError);
      setIsValid(!validationError && value.number.length > 0);
    }
  };

  // Check if we should show an error - only use internal errors or validation from form
  const externalError = validationErrors[element.id];
  const hasAnyError = hasError || !!internalError || !!externalError;
  // Prioritize internal format errors over external required field errors
  const errorToShow = internalError || externalError;

  return (
    <div className="space-y-6">
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
      >
        <div className="flex gap-2">
          {/* Country Code Select */}
          <Select
            value={currentCountryCode}
            onValueChange={handleCountryChange}
          >
            <SelectTrigger
              className={cn(
                "w-[100px]",
                hasAnyError && "border-red-500",
                isValid && !hasAnyError && "border-green-500"
              )}
              style={{
                borderColor: hasAnyError
                  ? "#ef4444"
                  : isFocused
                    ? currentTheme.primaryColor
                    : isValid
                      ? "#10b981"
                      : `${currentTheme.questionColor}33`,
                backgroundColor: currentTheme.backgroundColor,
                color: currentTheme.textColor,
              }}
            >
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+1">US (+1)</SelectItem>
              <SelectItem value="+44">UK (+44)</SelectItem>
              <SelectItem value="+91">IN (+91)</SelectItem>
              <SelectItem value="+33">FR (+33)</SelectItem>
              <SelectItem value="+49">DE (+49)</SelectItem>
              <SelectItem value="+81">JP (+81)</SelectItem>
              <SelectItem value="+86">CN (+86)</SelectItem>
            </SelectContent>
          </Select>

          {/* Phone Number Input */}
          <div className="flex-1 relative">
            <Input
              type="tel"
              value={value?.number || ""}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              placeholder={
                element.properties.placeholder || validationRule.example
              }
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
                    ? currentTheme.primaryColor
                    : isValid
                      ? "#10b981"
                      : `${currentTheme.questionColor}33`,
                backgroundColor: currentTheme.backgroundColor,
                color: currentTheme.textColor,
              }}
              aria-invalid={hasAnyError}
              aria-errormessage={hasAnyError ? "phone-error" : undefined}
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
        </div>

        {/* Only show error message if we have an error and no other component is showing it */}
        {errorToShow && (
          <motion.p
            id="phone-error"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm mt-2 text-red-500 flex items-center"
          >
            <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{errorToShow}</span>
          </motion.p>
        )}

        {/* Optional hint showing format for selected country */}
        {isFocused && !errorToShow && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm mt-2 text-gray-500"
          >
            Format: {validationRule.example}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

import { FormElement, FormElementType } from "@/types/form";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

function isDateElement(element: FormElement): element is FormElement & {
  type: FormElementType.DATE;
  properties: {
    minDate?: string;
    maxDate?: string;
    format: string;
    includeTime: boolean;
  };
} {
  return element.type === FormElementType.DATE;
}

interface DateInputProps {
  element: FormElement;
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
}

export function DateInput({ element, value, onChange }: DateInputProps) {
  if (!isDateElement(element)) {
    return null;
  }

  const minDate = element.properties.minDate
    ? new Date(element.properties.minDate)
    : undefined;
  const maxDate = element.properties.maxDate
    ? new Date(element.properties.maxDate)
    : undefined;

  return (
    <div className="space-y-2">
      <Label className="text-xl md:text-2xl font-medium leading-tight">
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (() => {
              try {
                return format(value, element.properties.format);
              } catch {
                return format(value, "PPP"); // Fallback to a safe format
              }
            })() : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            fromDate={minDate}
            toDate={maxDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {element.properties.includeTime && value && (
        <input
          type="time"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={value ? (() => {
            try {
              return format(value, "HH:mm");
            } catch {
              return "";
            }
          })() : ""}
          onChange={(e) => {
            if (value) {
              const [hours, minutes] = e.target.value.split(":").map(Number);
              const newDate = new Date(value);
              newDate.setHours(hours);
              newDate.setMinutes(minutes);
              onChange(newDate);
            }
          }}
        />
      )}
    </div>
  );
}

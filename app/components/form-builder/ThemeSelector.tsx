import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { themeOptions } from "@/lib/theme-options";
import { FormSettings } from "@/types/form";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ThemeSelectorProps {
  value: FormSettings["theme"];
  onChange: (colors: FormSettings["theme"]) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  // Find current theme
  const currentTheme = themeOptions.find(
    (option) =>
      option.colors.primaryColor === value.primaryColor &&
      option.colors.backgroundColor === value.backgroundColor &&
      option.colors.questionColor === value.questionColor
  );

  return (
    <div className="space-y-4">
      <div>
        <Label>Form Theme</Label>
        <p className="text-sm text-muted-foreground">
          Choose a theme that best matches your style
        </p>
      </div>

      <ScrollArea className="h-[320px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themeOptions.map((option) => {
            const isSelected = option.id === currentTheme?.id;

            return (
              <button
                key={option.id}
                className={cn(
                  "group relative rounded-lg p-4 w-full text-left transition-all",
                  "border-2",
                  isSelected
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "border-muted hover:border-primary/50"
                )}
                style={{
                  backgroundColor: option.colors.backgroundColor,
                }}
                onClick={() =>
                  onChange({
                    ...value,
                    ...option.colors,
                  })
                }
              >
                {/* Theme Preview */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div
                      className="font-medium"
                      style={{ color: option.colors.questionColor }}
                    >
                      {option.name}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: option.colors.questionColor + "99" }}
                    >
                      {option.description}
                    </div>
                  </div>

                  {/* Sample Form Elements */}
                  <div
                    className="space-y-2 rounded-md border p-3"
                    style={{ borderColor: option.colors.primaryColor + "33" }}
                  >
                    <div
                      className="h-2 w-16 rounded"
                      style={{ backgroundColor: option.colors.primaryColor }}
                    />
                    <div
                      className="h-2 w-12 rounded opacity-40"
                      style={{ backgroundColor: option.colors.primaryColor }}
                    />
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div
                      className="rounded-full p-1"
                      style={{ backgroundColor: option.colors.primaryColor }}
                    >
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { themeOptions } from "@/lib/theme-options";
import { FormSettings } from "@/types/form";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ThemeSelectorProps {
  value: FormSettings["theme"];
  onChange: (colors: FormSettings["theme"]) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const [filter, setFilter] = useState<"all" | "light" | "dark">("all");

  const filteredThemes = themeOptions.filter(
    (theme) => filter === "all" || theme.mode === filter
  );

  return (
    <div className="space-y-4">
      <div>
        <Label>Form Theme</Label>
        <p className="text-sm text-muted-foreground">
          Choose a theme that matches your brand and style
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "light" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("light")}
        >
          Light
        </Button>
        <Button
          variant={filter === "dark" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("dark")}
        >
          Dark
        </Button>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredThemes.map((option) => {
            const isSelected =
              option.colors.primaryColor === value.primaryColor;
            const isDark = option.mode === "dark";

            return (
              <button
                key={option.id}
                className={cn(
                  "group relative rounded-lg p-4 w-full text-left transition-all",
                  "border-2",
                  isDark ? "border-gray-700" : "border-gray-200"
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
                {/* Theme Preview Content */}
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
                      style={{ color: option.colors.textColor }}
                    >
                      {option.description}
                    </div>
                  </div>

                  {/* Sample Form Elements */}
                  <div
                    className="space-y-2 rounded-md border p-3"
                    style={{
                      borderColor: `${option.colors.primaryColor}33`,
                      backgroundColor: `${option.colors.backgroundColor}99`,
                    }}
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

                {/* Selection Indicator */}
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

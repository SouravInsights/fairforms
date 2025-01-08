import { colorSchemes, ColorSchemeName } from "@/lib/responses-theme-options";

interface ColorSchemeToggleProps {
  activeScheme: ColorSchemeName;
  onChange: (scheme: ColorSchemeName) => void;
}

export function ColorSchemeToggle({
  activeScheme,
  onChange,
}: ColorSchemeToggleProps) {
  const schemes = Object.entries(colorSchemes);

  console.log("ColorSchemeToggle rendered:", { activeScheme, schemes });

  return (
    <div className="fixed bottom-6 right-6 flex gap-2 p-2 rounded-full bg-white shadow-lg border">
      {schemes.map(([key, scheme]) => (
        <button
          key={key}
          onClick={() => {
            console.log("Color scheme button clicked:", key);
            onChange(key as ColorSchemeName);
          }}
          className={`
            w-8 h-8 rounded-full 
            transition-all duration-200
            border-2
            ${scheme.bg}
            ${
              activeScheme === key
                ? "scale-110 ring-2 ring-offset-2 ring-black/5"
                : "hover:scale-105 opacity-70 hover:opacity-100"
            }
          `}
          aria-label={`Switch to ${scheme.name} theme`}
        />
      ))}
    </div>
  );
}

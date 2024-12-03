import { FormElement, FormElementType, FormElementValue } from "@/types/form";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  element: FormElement & { type: FormElementType.WELCOME_SCREEN };
  onChange: (value: FormElementValue) => void;
}

export function WelcomeScreen({ element, onChange }: WelcomeScreenProps) {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">{element.properties.title}</h2>
      {element.properties.subtitle && (
        <p className="text-muted-foreground">{element.properties.subtitle}</p>
      )}
      <Button onClick={() => onChange(true)} className="mt-4">
        {element.properties.buttonText}
      </Button>
    </div>
  );
}

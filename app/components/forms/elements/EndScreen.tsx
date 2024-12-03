import { FormElement, FormElementType, FormElementValue } from "@/types/form";
import { Button } from "@/components/ui/button";

interface EndScreenProps {
  element: FormElement & { type: FormElementType.END_SCREEN };
  onChange: (value: FormElementValue) => void;
}

export function EndScreen({ element, onChange }: EndScreenProps) {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">{element.properties.title}</h2>
      <p className="text-muted-foreground">{element.properties.message}</p>
      {element.properties.buttonText && (
        <Button onClick={() => onChange(true)}>
          {element.properties.buttonText}
        </Button>
      )}
      {element.properties.showSocialShare && (
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="outline" size="sm">
            Share on Twitter
          </Button>
          <Button variant="outline" size="sm">
            Share on LinkedIn
          </Button>
        </div>
      )}
    </div>
  );
}

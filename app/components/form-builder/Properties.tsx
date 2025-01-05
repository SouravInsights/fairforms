import { useFormContext } from "@/app/context/form-context";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormElement, FormElementType } from "@/types/form";
import { MultipleChoiceProperties } from "./properties/MultipleChoiceProperties";
import { TextProperties } from "./properties/TextProperties";
import { ContactInfoProperties } from "./properties/ContactInfoProperties";
import { EmailProperties } from "./properties/EmailProperties";
import { PhoneProperties } from "./properties/PhoneProperties";
import { AddressProperties } from "./properties/AddressProperties";
import { WebsiteProperties } from "./properties/WebsiteProperties";
import { DateProperties } from "./properties/DateProperties";
import { NumberProperties } from "./properties/NumberProperties";
import { FileUploadProperties } from "./properties/FileUploadProperties";
import { WelcomeScreenProperties } from "./properties/WelcomeScreenProperties";
import { EndScreenProperties } from "./properties/EndScreenProperties";
import { ThemeSelector } from "./ThemeSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Properties({ className }: { className?: string }) {
  const { state, dispatch } = useFormContext();
  const activeElement = state.elements.find(
    (el) => el.id === state.activeElementId
  );

  if (!activeElement) return null;

  const updateElement = (updates: Partial<FormElement>) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        id: activeElement.id,
        updates: {
          ...updates,
          type: activeElement.type, // Ensure type stays the same
        } as FormElement,
      },
    });
  };

  const handleThemeChange = (theme: typeof state.settings.theme) => {
    dispatch({
      type: "UPDATE_SETTINGS",
      payload: { theme },
    });
  };

  const renderElementSpecificProperties = () => {
    switch (activeElement.type) {
      case FormElementType.MULTIPLE_CHOICE:
        return <MultipleChoiceProperties element={activeElement} />;
      case FormElementType.SHORT_TEXT:
      case FormElementType.LONG_TEXT:
        return <TextProperties element={activeElement} />;
      case FormElementType.CONTACT_INFO:
        return <ContactInfoProperties element={activeElement} />;
      case FormElementType.EMAIL:
        return <EmailProperties element={activeElement} />;
      case FormElementType.PHONE:
        return <PhoneProperties element={activeElement} />;
      case FormElementType.ADDRESS:
        return <AddressProperties element={activeElement} />;
      case FormElementType.WEBSITE:
        return <WebsiteProperties element={activeElement} />;
      case FormElementType.DATE:
        return <DateProperties element={activeElement} />;
      case FormElementType.NUMBER:
        return <NumberProperties element={activeElement} />;
      case FormElementType.FILE_UPLOAD:
        return <FileUploadProperties element={activeElement} />;
      case FormElementType.WELCOME_SCREEN:
        return <WelcomeScreenProperties element={activeElement} />;
      case FormElementType.END_SCREEN:
        return <EndScreenProperties element={activeElement} />;
      default:
        return null;
    }
  };

  // Only show question and required fields for elements that need them
  const showBasicFields = ![
    FormElementType.WELCOME_SCREEN,
    FormElementType.END_SCREEN,
    FormElementType.STATEMENT,
    FormElementType.REDIRECT,
  ].includes(activeElement.type);

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs defaultValue="content">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="p-4 space-y-4">
          {showBasicFields && (
            <>
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  value={activeElement.question}
                  onChange={(e) => updateElement({ question: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={activeElement.required}
                  onCheckedChange={(checked) =>
                    updateElement({ required: checked })
                  }
                />
                <Label>Required</Label>
              </div>
            </>
          )}
          {renderElementSpecificProperties()}
        </TabsContent>

        <TabsContent value="design" className="p-4">
          <ThemeSelector
            value={state.settings.theme}
            onChange={handleThemeChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

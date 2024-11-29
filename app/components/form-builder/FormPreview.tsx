import { Form, FormElement } from "@/types/form";
import { FormView } from "@/app/components/forms/FormView";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface FormPreviewProps {
  elements: FormElement[];
  formId: string;
  userId: string;
  title: string;
  description: string | null;
  settings: Form["settings"];
}

export function FormPreview({
  elements,
  formId,
  userId,
  title,
  description,
  settings,
}: FormPreviewProps) {
  const previewForm: Form = {
    id: parseInt(formId),
    userId,
    title,
    description,
    elements,
    settings,
    isPublished: true,
    customSlug: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <FormView form={previewForm} isPreview />
      </DialogContent>
    </Dialog>
  );
}

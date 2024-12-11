import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FormElement, FormTemplate } from "@/types/form";
import { Lock, Globe } from "lucide-react";

interface TemplatePreviewDialogProps {
  template: FormTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseTemplate: (templateId: number) => Promise<void>;
}

export function TemplatePreviewDialog({
  template,
  open,
  onOpenChange,
  onUseTemplate,
}: TemplatePreviewDialogProps) {
  if (!template) return null;

  const renderElementPreview = (element: FormElement) => {
    return (
      <div className="border rounded-lg p-4 mb-2">
        <div className="text-sm font-medium text-muted-foreground mb-1">
          {element.type}
        </div>
        <div className="font-medium">{element.question}</div>
        {element.description && (
          <div className="text-sm text-muted-foreground mt-1">
            {element.description}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{template.name}</DialogTitle>
            <Badge variant={template.isPublic ? "default" : "secondary"}>
              {template.isPublic ? (
                <Globe className="w-3 h-3 mr-1" />
              ) : (
                <Lock className="w-3 h-3 mr-1" />
              )}
              {template.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground">
            {template.elements.length} elements
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {template.elements.map((element) => (
              <div key={element.id}>{renderElementPreview(element)}</div>
            ))}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onUseTemplate(template.id)}>
            Use Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

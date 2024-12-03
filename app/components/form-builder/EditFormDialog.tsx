import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface EditFormDialogProps {
  title: string;
  description: string | null;
  onSave: (updates: { title: string; description: string }) => void;
}

export function EditFormDialog({
  title,
  description,
  onSave,
}: EditFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title,
    description: description || "",
  });

  const debouncedSave = useDebouncedCallback(
    (updates: { title: string; description: string }) => {
      onSave(updates);
    },
    500
  );

  const handleChange = (fieldName: "title" | "description", value: string) => {
    const newFormData = {
      ...formData,
      [fieldName]: value,
    };
    setFormData(newFormData);
    debouncedSave(newFormData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span className="font-medium truncate">
            {title || "Untitled Form"}
          </span>
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Form Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Form Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter form title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter form description"
              rows={3}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// app/components/forms/ManageCollaboratorsDialog.tsx
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsersRound, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/types/form";

interface Collaborator {
  id: number;
  email: string;
  role: "editor" | "viewer";
  status: "pending" | "accepted";
  addedAt: string;
}

interface ManageCollaboratorsDialogProps {
  form: Form;
}

export function ManageCollaboratorsDialog({
  form,
}: ManageCollaboratorsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"editor" | "viewer">("viewer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const loadCollaborators = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/forms/${form.id}/collaborators`);
      if (!response.ok) throw new Error("Failed to load collaborators");
      const data = await response.json();
      setCollaborators(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load collaborators",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [form.id, toast]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCollaborators([]);
    } else {
      loadCollaborators();
    }
  }, [isOpen, loadCollaborators]);

  const addCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/forms/${form.id}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, role: newRole }),
      });

      if (!response.ok) throw new Error("Failed to add collaborator");

      const newCollaborator = await response.json();
      setCollaborators([...collaborators, newCollaborator]);
      setNewEmail("");

      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add collaborator",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeCollaborator = async (collaboratorId: number) => {
    try {
      const response = await fetch(
        `/api/forms/${form.id}/collaborators?collaboratorId=${collaboratorId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to remove collaborator");

      setCollaborators(collaborators.filter((c) => c.id !== collaboratorId));

      toast({
        title: "Success",
        description: "Collaborator removed successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove collaborator",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) loadCollaborators();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <UsersRound className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Collaborators</DialogTitle>
          <DialogDescription>
            Add or remove collaborators for this form. Collaborators can view
            responses or edit the form based on their role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={addCollaborator} className="space-y-4 mt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Email address"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1"
            />
            <Select
              value={newRole}
              onValueChange={(value: "editor" | "viewer") => setNewRole(value)}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Invite...
              </>
            ) : (
              "Add Collaborator"
            )}
          </Button>
        </form>

        <div className="mt-6">
          <h4 className="text-sm font-semibold mb-3">Current Collaborators</h4>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : collaborators.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No collaborators yet
            </p>
          ) : (
            <div className="space-y-2">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {collaborator.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {collaborator.role} • {collaborator.status}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCollaborator(collaborator.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

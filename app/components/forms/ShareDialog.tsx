import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/types/form";

interface ShareDialogProps {
  form: Form;
  onUpdate: (updates: Partial<Form>) => Promise<void>;
}

export function ShareDialog({ form, onUpdate }: ShareDialogProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [slugError, setSlugError] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const formUrl = form.customSlug
    ? `${baseUrl}/forms/${form.customSlug}`
    : `${baseUrl}/forms/${form.id}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const validateSlug = async (slug: string) => {
    if (!slug) return true;

    try {
      setIsValidating(true);
      const response = await fetch("/api/forms/validate-slug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          currentFormId: form.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setSlugError(data.error);
        return false;
      }

      setSlugError("");
      return true;
    } catch {
      setSlugError("Failed to validate URL");
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSlugUpdate = async (newSlug: string) => {
    if (isUpdating || isValidating) return;

    try {
      setIsUpdating(true);

      const isValid = await validateSlug(newSlug);
      if (!isValid) return;

      await onUpdate({ customSlug: newSlug });
      toast({
        title: "Success",
        description: "Custom URL updated successfully",
      });
      setSlugError("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to update custom URL",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Share Form</DialogTitle>
          <DialogDescription>
            Customize how your form appears when shared
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Form URL</Label>
                <div className="flex gap-2 mt-2">
                  <Input value={formUrl} readOnly />
                  <Button
                    variant="secondary"
                    onClick={() => copyToClipboard(formUrl)}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <Label>Custom URL</Label>
                <div className="flex gap-2 mt-2">
                  <div className="flex-1 flex items-center gap-1 rounded-md border px-3 bg-muted">
                    <span className="text-muted-foreground">
                      {baseUrl}/forms/
                    </span>
                    <Input
                      className="border-0 bg-transparent p-0"
                      defaultValue={form.customSlug || ""}
                      placeholder="custom-url"
                      onChange={(e) => {
                        const value = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-")
                          .replace(/-+/g, "-")
                          .replace(/^-|-$/g, "");
                        e.target.value = value;
                        setSlugError("");
                      }}
                      onBlur={(e) => validateSlug(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => handleSlugUpdate(form.customSlug || "")}
                    disabled={isUpdating || isValidating || !!slugError}
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </Button>
                </div>
                {slugError && (
                  <p className="text-sm text-destructive mt-1">{slugError}</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  placeholder="Enter page title"
                  defaultValue={form.metaTitle || form.title}
                />
              </div>

              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Input
                  placeholder="Enter page description"
                  defaultValue={form.metaDescription || form.description || ""}
                />
              </div>

              <div className="space-y-2">
                <Label>Social Image</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Upload or enter image URL"
                    defaultValue={form.socialImageUrl || ""}
                  />
                  <Button variant="secondary">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Embed Code</Label>
                <Input
                  readOnly
                  value={`<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`}
                />
                <Button
                  variant="secondary"
                  onClick={() =>
                    copyToClipboard(
                      `<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`
                    )
                  }
                >
                  Copy Code
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

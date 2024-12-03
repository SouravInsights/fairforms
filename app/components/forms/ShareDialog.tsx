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
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/types/form";
import { cn } from "@/lib/utils";

interface ShareDialogProps {
  form: Form;
  onUpdate: (updates: Partial<Form>) => Promise<void>;
}

export function ShareDialog({ form, onUpdate }: ShareDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [slugError, setSlugError] = useState<string | null>("");
  const [customSlug, setCustomSlug] = useState(form.customSlug || "");
  const [isValidating, setIsValidating] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  // Fetch form data when dialog opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchFormData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/forms/${form.id}`);
        if (!response.ok) throw new Error("Failed to load form data");

        const data = await response.json();
        setCustomSlug(data.customSlug || "");
        setSlugError(null);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load form data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
  }, [isOpen, form.id, toast]);

  // Calculate current URL based on customSlug state
  const getCurrentUrl = () => {
    const formattedSlug = formatSlug(customSlug);
    if (formattedSlug) {
      return `${baseUrl}/forms/${formattedSlug}`;
    }
    return `${baseUrl}/forms/${form.id}`;
  };

  useEffect(() => {
    setCustomSlug(form.customSlug || "");
  }, [form.customSlug]);

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

  const formatSlug = (input: string): string => {
    return input
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/[^a-z0-9-]/g, "") // Remove any characters that aren't letters, numbers, or hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
  };

  const validateSlug = async (slug: string): Promise<boolean> => {
    if (!slug) return true;

    try {
      setIsValidating(true);
      const response = await fetch("/api/forms/validate-slug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: formatSlug(slug),
          currentFormId: form.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSlugError(data.error);
        return false;
      }

      setSlugError(null);
      return true;
    } catch {
      setSlugError("Failed to validate URL");
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSlugChange = (value: string) => {
    setCustomSlug(value);
    setSlugError(null);
  };

  const handleSlugUpdate = async () => {
    if (isUpdating || isValidating) return;

    try {
      setIsUpdating(true);

      const formattedSlug = formatSlug(customSlug);
      const isValid = await validateSlug(formattedSlug);

      if (!isValid) return;

      await onUpdate({ customSlug: formattedSlug || null });

      toast({
        title: "Success",
        description: "Custom URL updated successfully",
      });

      setSlugError(null);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                Loading...
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Form URL</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={getCurrentUrl()}
                      readOnly
                      className={cn(
                        "font-mono text-sm",
                        customSlug && !slugError
                          ? "text-muted-foreground"
                          : "text-destructive/50"
                      )}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => copyToClipboard(getCurrentUrl())}
                      disabled={!!slugError}
                    >
                      Copy
                    </Button>
                  </div>
                  {customSlug &&
                    !slugError &&
                    form.customSlug !== customSlug && (
                      <p className="text-sm text-muted-foreground mt-1">
                        This URL will be active once you save
                      </p>
                    )}
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
                        value={customSlug}
                        placeholder="custom-url"
                        onChange={(e) => handleSlugChange(e.target.value)}
                        onBlur={() => validateSlug(customSlug)}
                      />
                    </div>
                    <Button
                      onClick={handleSlugUpdate}
                      disabled={
                        isUpdating ||
                        isValidating ||
                        !!slugError ||
                        form.customSlug === customSlug
                      }
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </Button>
                  </div>
                  {slugError && (
                    <p className="text-sm text-destructive mt-1">{slugError}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    You can use letters, numbers, and hyphens. Spaces will
                    automatically be converted to hyphens.
                  </p>
                </div>
              </div>
            )}
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

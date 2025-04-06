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
  const [slugError, setSlugError] = useState<string | null>(null);
  const [customSlug, setCustomSlug] = useState(form.customSlug || "");
  const [seoData, setSeoData] = useState({
    metaTitle: form.metaTitle || form.title,
    metaDescription: form.metaDescription || form.description || "",
    socialImageUrl: form.socialImageUrl || "",
  });
  const [isSeoUpdating, setIsSeoUpdating] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  // Update local state when form prop changes
  useEffect(() => {
    setCustomSlug(form.customSlug || "");
    setSeoData({
      metaTitle: form.metaTitle || form.title,
      metaDescription: form.metaDescription || form.description || "",
      socialImageUrl: form.socialImageUrl || "",
    });
  }, [form]);

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
        setSeoData({
          metaTitle: data.metaTitle || data.title,
          metaDescription: data.metaDescription || data.description || "",
          socialImageUrl: data.socialImageUrl || "",
        });
        setSlugError(null);
      } catch (error) {
        console.error("Error loading form data:", error);
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
    } catch (error) {
      console.error("Error validating slug:", error);
      setSlugError("Failed to validate URL");
      return false;
    }
  };

  const handleSlugChange = (value: string) => {
    setCustomSlug(value);
    setSlugError(null);
  };

  const handleSlugUpdate = async () => {
    if (isUpdating) {
      return;
    }

    // Format the slug once
    const formattedSlug = formatSlug(customSlug);

    // Don't update if slug hasn't changed from what's already saved
    if (form.customSlug === formattedSlug) {
      return;
    }

    try {
      // Set updating state to prevent multiple clicks
      setIsUpdating(true);

      // First validate the slug
      const isValid = await validateSlug(formattedSlug);

      if (!isValid) {
        return; // Exit early if validation fails
      }

      // Make direct API request to update the slug
      const updateResponse = await fetch(`/api/forms/${form.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customSlug: formattedSlug || null,
        }),
      });

      // Handle API errors
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error("API error:", errorData);
        throw new Error("Failed to update custom URL");
      }

      // Parse the response
      const updatedForm = await updateResponse.json();

      // Update the local state
      setCustomSlug(updatedForm.customSlug || "");

      // Show success message
      toast({
        title: "Success",
        description: "Custom URL updated successfully",
      });

      // Clear any previous errors
      setSlugError(null);

      // Call onUpdate to keep parent state in sync
      await onUpdate({ customSlug: formattedSlug || null });
    } catch (error) {
      console.error("Error updating slug:", error);
      toast({
        title: "Error",
        description: "Failed to update custom URL",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSeoChange = (field: keyof typeof seoData, value: string) => {
    setSeoData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSeoUpdate = async () => {
    if (isSeoUpdating) return;

    try {
      setIsSeoUpdating(true);

      const updateResponse = await fetch(`/api/forms/${form.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metaTitle: seoData.metaTitle,
          metaDescription: seoData.metaDescription,
          socialImageUrl: seoData.socialImageUrl,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update SEO settings");
      }

      // Also update parent state
      await onUpdate({
        metaTitle: seoData.metaTitle,
        metaDescription: seoData.metaDescription,
        socialImageUrl: seoData.socialImageUrl,
      });

      toast({
        title: "Success",
        description: "SEO settings updated successfully",
      });
    } catch (error) {
      console.error("Error updating SEO settings:", error);
      toast({
        title: "Error",
        description: "Failed to update SEO settings",
        variant: "destructive",
      });
    } finally {
      setIsSeoUpdating(false);
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
                    form.customSlug !== formatSlug(customSlug) && (
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
                        !!slugError ||
                        form.customSlug === formatSlug(customSlug)
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
                  value={seoData.metaTitle}
                  onChange={(e) => handleSeoChange("metaTitle", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Input
                  placeholder="Enter page description"
                  value={seoData.metaDescription}
                  onChange={(e) =>
                    handleSeoChange("metaDescription", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Social Image</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Upload or enter image URL"
                    value={seoData.socialImageUrl}
                    onChange={(e) =>
                      handleSeoChange("socialImageUrl", e.target.value)
                    }
                  />
                  <Button variant="secondary">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleSeoUpdate}
                disabled={isSeoUpdating}
              >
                {isSeoUpdating ? "Saving..." : "Save SEO Settings"}
              </Button>
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

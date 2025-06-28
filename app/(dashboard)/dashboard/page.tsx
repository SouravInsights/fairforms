"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Plus,
  Loader2,
  MoreVertical,
  Globe,
  Lock,
  CheckCircle,
  Send,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Form, FormTemplate } from "@/types/form";
import { SaveAsTemplateDialog } from "@/app/components/form-builder/SaveAsTemplateDialog";
import { TemplatePreviewDialog } from "@/app/components/form-builder/TemplatePreviewDialog";
import { DeleteConfirmationDialog } from "@/app/components/form-builder/DeleteConfirmationDialog";
import { AIPromptModal } from "@/app/components/form-builder/AIPromptModal";

interface FormWithResponseCount extends Form {
  responseCount: number;
  isCollaborator?: boolean;
  role?: "owner" | "editor" | "viewer";
}

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoaded } = useUser();

  const [forms, setForms] = useState<FormWithResponseCount[]>([]);
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [activeTab, setActiveTab] = useState("forms");
  const [formFilter, setFormFilter] = useState<"all" | "draft" | "published">(
    "all"
  );
  const [templateDialogIsOpen, setTemplateDialogIsOpen] = useState(false);
  const [saveTemplateForm, setSaveTemplateForm] = useState<Form | null>(null);
  const [templateToPreview, setTemplateToPreview] =
    useState<FormTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<FormTemplate | null>(
    null
  );
  const [formToDelete, setFormToDelete] = useState<Form | null>(null);
  const [publishingFormId, setPublishingFormId] = useState<number | null>(null);

  useEffect(() => {
    const loadForms = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/forms");
        if (!response.ok) {
          throw new Error("Failed to load forms");
        }
        const data = await response.json();
        setForms(data);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load forms. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      loadForms();
    }
  }, [user, isLoaded, toast]);

  useEffect(() => {
    const loadTemplates = async () => {
      if (!user || activeTab !== "templates") return;

      try {
        setLoadingTemplates(true);
        const response = await fetch("/api/templates");
        if (!response.ok) {
          throw new Error("Failed to load templates");
        }
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error("Failed to load templates:", error);
        toast({
          title: "Error",
          description: "Failed to load templates. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingTemplates(false);
      }
    };

    loadTemplates();
  }, [user, activeTab, toast]);

  const handleCreateForm = async (templateId?: number) => {
    if (isCreating) return;

    try {
      setIsCreating(true);
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create form");
      }

      const newForm = await response.json();
      router.push(`/dashboard/forms/${newForm.id}`);
    } catch {
      toast({
        title: "Error",
        description: "Failed to create form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
      setTemplateDialogIsOpen(false);
    }
  };

  const handleDeleteForm = async (form: Form) => {
    try {
      const response = await fetch(`/api/forms/${form.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete form");
      }

      setForms((prev) => prev.filter((f) => f.id !== form.id));
      toast({
        title: "Success",
        description: "Form deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete form",
        variant: "destructive",
      });
    } finally {
      setFormToDelete(null);
    }
  };

  const handleDeleteTemplate = async (template: FormTemplate) => {
    try {
      const response = await fetch(`/api/templates/${template.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete template");
      }

      setTemplates((prev) => prev.filter((t) => t.id !== template.id));
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    } finally {
      setTemplateToDelete(null);
    }
  };

  const handlePublishForm = async (formId: number) => {
    if (publishingFormId === formId) return; // Prevent double clicks

    try {
      setPublishingFormId(formId);

      // Get the current form data first
      const formResponse = await fetch(`/api/forms/${formId}`);
      if (!formResponse.ok) {
        throw new Error("Failed to get form data");
      }
      const formData = await formResponse.json();

      const response = await fetch(`/api/forms/${formId}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          elements: formData.elements,
          title: formData.title,
          description: formData.description,
          settings: formData.settings,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish form");
      }

      // Update the form in the local state
      setForms((prev) =>
        prev.map((form) =>
          form.id === formId ? { ...form, isPublished: true } : form
        )
      );

      toast({
        title: "Success",
        description:
          "Form published successfully! It's now publicly accessible.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to publish form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPublishingFormId(null);
    }
  };

  const handleSaveTemplate = async (
    formId: number,
    templateData: {
      name: string;
      description: string;
      isPublic: boolean;
    }
  ) => {
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: templateData.name,
          description: templateData.description,
          isPublic: templateData.isPublic,
          formId: formId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save template");
      }

      toast({
        title: "Success",
        description: `Template saved ${
          templateData.isPublic ? "and published publicly" : "privately"
        }`,
      });

      // Refresh templates if we're on the templates tab
      if (activeTab === "templates") {
        const templatesResponse = await fetch("/api/templates");
        if (templatesResponse.ok) {
          const data = await templatesResponse.json();
          setTemplates(data);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save as template. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredForms = forms.filter((form) => {
    if (formFilter === "all") return true;
    if (formFilter === "draft") return !form.isPublished;
    if (formFilter === "published") return form.isPublished;
    return true;
  });

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500 mx-auto" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage your forms and templates
            </p>
          </div>
          <div className="flex gap-3">
            <AIPromptModal />
            <Button
              onClick={() => setTemplateDialogIsOpen(true)}
              variant="outline"
              disabled={isCreating}
              className="font-medium"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Form
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="forms"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center">
            <TabsList className="bg-white border border-gray-200 p-1">
              <TabsTrigger value="forms">My Forms</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            {activeTab === "forms" && (
              <div className="bg-card border border-border rounded-lg p-1">
                <button
                  onClick={() => setFormFilter("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    formFilter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  All ({forms.length})
                </button>
                <button
                  onClick={() => setFormFilter("draft")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    formFilter === "draft"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Draft ({forms.filter((f) => !f.isPublished).length})
                </button>
                <button
                  onClick={() => setFormFilter("published")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    formFilter === "published"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Published ({forms.filter((f) => f.isPublished).length})
                </button>
              </div>
            )}
          </div>

          <TabsContent value="forms" className="space-y-6">
            {filteredForms.length === 0 ? (
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-gray-900">
                    {formFilter === "all"
                      ? "No forms yet"
                      : `No ${formFilter} forms`}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {formFilter === "all"
                      ? "Create your first form to get started"
                      : `You don't have any ${formFilter} forms yet`}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center flex gap-4 pt-4 border-t border-gray-100">
                  <AIPromptModal />
                  <Button
                    onClick={() => setTemplateDialogIsOpen(true)}
                    disabled={isCreating}
                    className="font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Form
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredForms.map((form) => (
                  <Card
                    key={form.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1 min-w-0">
                          <CardTitle className="line-clamp-1 flex items-center gap-2">
                            <span className="truncate">{form.title}</span>
                            {form.isCollaborator && (
                              <Badge variant="secondary" className="text-xs">
                                {form.role === "editor" ? "Editor" : "Viewer"}
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                form.isPublished ? "default" : "secondary"
                              }
                              className={`text-xs font-medium flex items-center gap-1 ${
                                form.isPublished
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {form.isPublished ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  Published
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3" />
                                  Draft
                                </>
                              )}
                            </Badge>
                          </div>
                          <CardDescription>
                            {form.responseCount}{" "}
                            {form.responseCount === 1
                              ? "response"
                              : "responses"}
                            <br />
                            Created {formatDate(form.createdAt)}
                          </CardDescription>
                        </div>
                        {!form.isCollaborator && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setSaveTemplateForm(form)}
                              >
                                Save as Template
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setFormToDelete(form)}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                Delete Form
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </CardHeader>
                    <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                      <Link href={`/dashboard/forms/${form.id}`}>
                        <Button variant="ghost">Edit</Button>
                      </Link>
                      <Link href={`/dashboard/forms/${form.id}/responses`}>
                        <Button variant="outline">Responses</Button>
                      </Link>
                      {form.isPublished ? (
                        <Link href={`/forms/${form.customSlug || form.id}`}>
                          <Button>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          onClick={() => handlePublishForm(form.id)}
                          disabled={publishingFormId === form.id}
                        >
                          {publishingFormId === form.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Publishing...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Publish
                            </>
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            {loadingTemplates ? (
              <div className="flex justify-center p-12">
                <div className="text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-rose-500 mx-auto" />
                  <p className="text-gray-600">Loading templates...</p>
                </div>
              </div>
            ) : templates.length === 0 ? (
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-gray-900">
                    No templates yet
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Save your forms as templates to reuse them later
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="border-border bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1 min-w-0">
                          <CardTitle className="flex items-center gap-2 text-card-foreground">
                            <span className="truncate">{template.name}</span>
                            <Badge
                              variant={
                                template.isPublic ? "default" : "secondary"
                              }
                              className={`text-xs font-medium ${
                                template.isPublic
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {template.isPublic ? (
                                <Globe className="w-3 h-3 mr-1" />
                              ) : (
                                <Lock className="w-3 h-3 mr-1" />
                              )}
                              {template.isPublic ? "Public" : "Private"}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {template.description}
                          </CardDescription>
                        </div>
                        {template.userId === user?.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-foreground hover:bg-muted"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-popover border-border"
                            >
                              <DropdownMenuItem
                                onClick={() => setTemplateToDelete(template)}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                Delete Template
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="text-sm text-muted-foreground">
                        {template.elements.length} elements
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setTemplateToPreview(template)}
                      >
                        Preview
                      </Button>
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                        onClick={() => handleCreateForm(template.id)}
                      >
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Form Dialog */}
        <Dialog
          open={templateDialogIsOpen}
          onOpenChange={setTemplateDialogIsOpen}
        >
          <DialogContent className="max-w-5xl bg-white border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-gray-900">
                Create New Form
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="border-gray-200 bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    Start Fresh
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Create a form from scratch
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    onClick={() => handleCreateForm()}
                    className="w-full"
                    disabled={isCreating}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Blank Form
                  </Button>
                </CardFooter>
              </Card>

              <div className="lg:col-span-3">
                <Tabs defaultValue="all">
                  <TabsList className="bg-card border border-border p-1">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      All Templates
                    </TabsTrigger>
                    <TabsTrigger
                      value="popular"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Popular
                    </TabsTrigger>
                    <TabsTrigger
                      value="recent"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Recent
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-6">
                    <ScrollArea className="h-[450px] pr-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loadingTemplates ? (
                          <Card className="col-span-2 p-8 border-gray-200">
                            <CardContent className="flex justify-center">
                              <div className="text-center space-y-3">
                                <Loader2 className="w-6 h-6 animate-spin text-rose-500 mx-auto" />
                                <p className="text-gray-600">
                                  Loading templates...
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ) : templates.length === 0 ? (
                          <Card className="col-span-2 p-8 border-gray-200">
                            <CardHeader>
                              <CardTitle className="text-center text-gray-900">
                                No templates available
                              </CardTitle>
                              <CardDescription className="text-center text-gray-600">
                                Start with a blank form or check back later for
                                templates
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        ) : (
                          templates.map((template) => (
                            <Card
                              key={template.id}
                              className="cursor-pointer hover:border-rose-200 hover:shadow-md transition-all border-gray-200"
                              onClick={() => setTemplateToPreview(template)}
                            >
                              <CardHeader>
                                <CardTitle className="text-lg line-clamp-1 text-gray-900">
                                  {template.name}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-gray-600">
                                  {template.description}
                                </CardDescription>
                              </CardHeader>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="popular" className="mt-6">
                    <Card className="p-12 border-gray-200">
                      <CardContent className="text-center text-gray-500">
                        Coming soon
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="recent" className="mt-6">
                    <Card className="p-12 border-gray-200">
                      <CardContent className="text-center text-gray-500">
                        Coming soon
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialogs */}
        <SaveAsTemplateDialog
          open={saveTemplateForm !== null}
          onOpenChange={(open) => !open && setSaveTemplateForm(null)}
          form={saveTemplateForm}
          onSave={async (templateData) => {
            if (saveTemplateForm) {
              await handleSaveTemplate(saveTemplateForm.id, templateData);
            }
          }}
        />

        <TemplatePreviewDialog
          template={templateToPreview}
          open={templateToPreview !== null}
          onOpenChange={(open) => !open && setTemplateToPreview(null)}
          onUseTemplate={async (templateId) => {
            await handleCreateForm(templateId);
            setTemplateToPreview(null);
          }}
        />

        <DeleteConfirmationDialog
          open={formToDelete !== null}
          onOpenChange={(open) => !open && setFormToDelete(null)}
          onConfirm={async () => {
            if (formToDelete) {
              await handleDeleteForm(formToDelete);
            }
          }}
          title="Delete Form"
          description="Are you sure you want to delete this form? This action cannot be undone."
        />

        <DeleteConfirmationDialog
          open={templateToDelete !== null}
          onOpenChange={(open) => !open && setTemplateToDelete(null)}
          onConfirm={async () => {
            if (templateToDelete) {
              await handleDeleteTemplate(templateToDelete);
            }
          }}
          title="Delete Template"
          description="Are you sure you want to delete this template? This action cannot be undone."
        />
      </div>
    </div>
  );
}

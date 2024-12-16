"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Plus, Loader2, MoreVertical, Globe, Lock } from "lucide-react";
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
  const [templateDialogIsOpen, setTemplateDialogIsOpen] = useState(false);
  const [saveTemplateForm, setSaveTemplateForm] = useState<Form | null>(null);
  const [templateToPreview, setTemplateToPreview] =
    useState<FormTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<FormTemplate | null>(
    null
  );
  const [formToDelete, setFormToDelete] = useState<Form | null>(null);

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

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button
          onClick={() => setTemplateDialogIsOpen(true)}
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create New Form
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="forms" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="forms">My Forms</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          {forms.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">No forms yet</CardTitle>
                <CardDescription className="text-center">
                  Create your first form to get started
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-center">
                <Button
                  onClick={() => setTemplateDialogIsOpen(true)}
                  disabled={isCreating}
                >
                  Create Form
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map((form) => (
                <Card key={form.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="line-clamp-1 flex items-center gap-2">
                          {form.title}
                          {form.isCollaborator && (
                            <Badge variant="secondary" className="text-xs">
                              {form.role === "editor" ? "Editor" : "Viewer"}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {form.responseCount}{" "}
                          {form.responseCount === 1 ? "response" : "responses"}
                          <br />
                          Created on {formatDate(form.createdAt)}
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
                              className="text-red-600"
                            >
                              Delete Form
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  <CardFooter className="flex justify-end gap-2">
                    <Link href={`/dashboard/forms/${form.id}`}>
                      <Button variant="outline">Edit</Button>
                    </Link>
                    <Link href={`/dashboard/forms/${form.id}/responses`}>
                      <Button variant="outline">Responses</Button>
                    </Link>
                    <Link href={`/forms/${form.customSlug || form.id}`}>
                      <Button>View</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {loadingTemplates ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">No templates yet</CardTitle>
                <CardDescription className="text-center">
                  Save your forms as templates to reuse them later
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="hover:border-primary/50 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {template.name}
                          <Badge
                            variant={
                              template.isPublic ? "default" : "secondary"
                            }
                          >
                            {template.isPublic ? (
                              <Globe className="w-3 h-3 mr-1" />
                            ) : (
                              <Lock className="w-3 h-3 mr-1" />
                            )}
                            {template.isPublic ? "Public" : "Private"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      </div>
                      {template.userId === user?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setTemplateToDelete(template)}
                              className="text-red-600"
                            >
                              Delete Template
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {template.elements.length} elements
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setTemplateToPreview(template)}
                    >
                      Preview
                    </Button>
                    <Button
                      className="flex-1"
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

      <Dialog
        open={templateDialogIsOpen}
        onOpenChange={setTemplateDialogIsOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-4 gap-4">
            <Card className="col-span-4 md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Start Fresh</CardTitle>
                <CardDescription>Create a form from scratch</CardDescription>
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

            <div className="col-span-4 md:col-span-3">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Templates</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="grid grid-cols-2 gap-4">
                      {loadingTemplates ? (
                        <Card className="col-span-2 p-8">
                          <CardContent className="flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin" />
                          </CardContent>
                        </Card>
                      ) : templates.length === 0 ? (
                        <Card className="col-span-2 p-8">
                          <CardHeader>
                            <CardTitle className="text-center">
                              No templates available
                            </CardTitle>
                            <CardDescription className="text-center">
                              Start with a blank form or check back later for
                              templates
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      ) : (
                        templates.map((template) => (
                          <Card
                            key={template.id}
                            className="cursor-pointer hover:border-primary transition-colors"
                            onClick={() => setTemplateToPreview(template)}
                          >
                            <CardHeader>
                              <CardTitle className="text-lg line-clamp-1">
                                {template.name}
                              </CardTitle>
                              <CardDescription className="line-clamp-2">
                                {template.description}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="popular">
                  <Card className="p-8">
                    <CardContent className="text-center text-muted-foreground">
                      Coming soon
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recent">
                  <Card className="p-8">
                    <CardContent className="text-center text-muted-foreground">
                      Coming soon
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
  );
}

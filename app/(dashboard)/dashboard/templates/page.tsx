"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Globe, Lock, MoreVertical, Loader2, Plus, Trash2 } from "lucide-react";
import { FormTemplate } from "@/types/form";

export default function TemplatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch("/api/templates");
        if (!response.ok) throw new Error("Failed to load templates");
        const data = await response.json();
        setTemplates(data);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load templates. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [toast]);

  const handleCreateForm = async (templateId: number) => {
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateId }),
      });

      if (!response.ok) throw new Error("Failed to create form");
      const newForm = await response.json();
      router.push(`/dashboard/forms/${newForm.id}`);
    } catch {
      toast({
        title: "Error",
        description: "Failed to create form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete template");

      setTemplates(templates.filter((template) => template.id !== templateId));
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const myTemplates = templates.filter(
    (template) => template.userId === user?.id
  );
  const publicTemplates = templates.filter(
    (template) => template.isPublic && template.userId !== user?.id
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Form Templates</h1>
        <Button onClick={() => router.push("/dashboard/forms/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </div>

      <Tabs defaultValue="my-templates">
        <TabsList>
          <TabsTrigger value="my-templates">
            My Templates ({myTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="public">
            Public Templates ({publicTemplates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-templates" className="mt-4">
          {myTemplates.length === 0 ? (
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
              {myTemplates.map((template) => (
                <Card key={template.id}>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Template
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      className="w-full"
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

        <TabsContent value="public" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="space-y-1">
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleCreateForm(template.id)}
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

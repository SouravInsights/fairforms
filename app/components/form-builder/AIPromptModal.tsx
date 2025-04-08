"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Sparkles, MessageSquare, Search, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  PROMPT_TEMPLATES,
  searchPromptTemplates,
  getPromptTemplatesByTags,
} from "@/lib/ai/prompt-templates";

export function AIPromptModal() {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const router = useRouter();
  const { toast } = useToast();

  // Filter templates based on search and tags
  const filteredTemplates = (() => {
    let templates = [...PROMPT_TEMPLATES];

    if (searchQuery) {
      templates = searchPromptTemplates(searchQuery);
    }

    if (selectedTags.length > 0) {
      templates = getPromptTemplatesByTags(selectedTags);
    }

    return templates;
  })();

  // Extract unique tags from all templates
  const allTags = Array.from(
    new Set(PROMPT_TEMPLATES.flatMap((template) => template.tags))
  ).sort();

  const handleSelectTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    setActiveTab("write");
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleGenerateForm = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description of your form",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/generate-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate form");
      }

      const data = await response.json();

      // Navigate to the new form
      if (data.formId) {
        router.push(`/dashboard/forms/${data.formId}`);
        toast({
          title: "Form created!",
          description:
            "Your form has been generated based on your description.",
        });
      }
    } catch (error) {
      console.error("Error generating form:", error);
      toast({
        title: "Error",
        description: "Failed to generate form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Create with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create form with AI</DialogTitle>
          <DialogDescription>
            Describe the form you want to create, or choose from a template
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs
            defaultValue="write"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="write">
                <MessageSquare className="h-4 w-4 mr-2" />
                Write Prompt
              </TabsTrigger>
              <TabsTrigger value="templates">
                <Sparkles className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="mt-4 flex flex-col">
              <Textarea
                placeholder="Describe the form you want to create in detail. For example: Create a customer feedback form with a 5-star rating system, fields for name, email, and comments."
                className="flex-1 min-h-[250px] mb-4 resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <DialogFooter>
                <Button
                  onClick={handleGenerateForm}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Form
                    </>
                  )}
                </Button>
              </DialogFooter>
            </TabsContent>

            <TabsContent value="templates" className="mt-4">
              <div className="space-y-4">
                {/* Search and filter section */}
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                {/* Tags filter */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Filter by:
                  </span>
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        selectedTags.includes(tag) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Templates grid */}
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-1 gap-4 pr-4">
                    {filteredTemplates.length === 0 ? (
                      <Card className="p-4 text-center">
                        <CardContent className="pt-4">
                          <p className="text-muted-foreground">
                            No templates match your criteria
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredTemplates.map((template) => (
                        <Card
                          key={template.id}
                          className="cursor-pointer hover:border-primary hover:shadow-sm transition-all"
                          onClick={() => handleSelectTemplate(template.prompt)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">
                                {template.name}
                              </CardTitle>
                              <div className="flex gap-1 flex-wrap">
                                {template.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <CardDescription>
                              {template.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {template.previewFields && (
                              <div className="flex flex-wrap gap-1">
                                {template.previewFields.map((field) => (
                                  <Badge
                                    key={field}
                                    variant="outline"
                                    className="bg-muted"
                                  >
                                    {field}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="border-t pt-3 text-sm text-muted-foreground">
                            Click to use this template
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

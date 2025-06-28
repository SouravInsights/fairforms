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
import {
  Loader2,
  Sparkles,
  MessageSquare,
  Search,
  Tag,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  PROMPT_TEMPLATES,
  PromptTemplate,
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
  const [selectedTemplate, setSelectedTemplate] =
    useState<PromptTemplate | null>(null);

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

  // Extract unique tags from all templates and sort alphabetically
  const allTags = Array.from(
    new Set(PROMPT_TEMPLATES.flatMap((template) => template.tags))
  ).sort();

  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setPrompt(template.prompt);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      setPrompt(selectedTemplate.prompt);
      setActiveTab("write");
      setSelectedTemplate(null);
    }
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

  const clearSelection = () => {
    setSelectedTemplate(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" variant="gradient">
          <Sparkles className="h-4 w-4" />
          Create with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-hidden flex flex-col">
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
              {selectedTemplate ? (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                    >
                      Back to templates
                    </Button>
                    <div className="flex gap-1">
                      {selectedTemplate.tags.map((tag) => (
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

                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle>{selectedTemplate.name}</CardTitle>
                      <CardDescription>
                        {selectedTemplate.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            This template will create a form with:
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedTemplate.previewFields?.map((field) => (
                              <div
                                key={field}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                <span>{field}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Template prompt:
                          </h4>
                          <div className="bg-muted rounded-md p-3 text-sm">
                            {selectedTemplate.prompt}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleUseTemplate} className="w-full">
                        Use This Template
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ) : (
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
                        className="cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Templates grid */}
                  <ScrollArea className="h-[400px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                      {filteredTemplates.length === 0 ? (
                        <Card className="p-4 text-center md:col-span-2">
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
                            onClick={() => handleSelectTemplate(template)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg truncate">
                                  {template.name}
                                </CardTitle>
                              </div>
                              <CardDescription className="line-clamp-2">
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
                            <CardFooter className="flex justify-between items-center border-t pt-3 text-sm text-muted-foreground">
                              <span>Use template</span>
                              <div className="flex gap-1">
                                {template.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {template.tags.length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    +{template.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </CardFooter>
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

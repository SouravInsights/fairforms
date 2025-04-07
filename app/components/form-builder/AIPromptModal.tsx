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
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// Sample prompt templates to get users started. Cause most users don't know how to write good prompts..
const PROMPT_TEMPLATES = [
  {
    id: "contact",
    name: "Contact Form",
    description: "Basic contact form with name, email, and message fields",
    prompt:
      "Create a contact form with fields for name, email, phone number, and a message box. Add validation for the email field.",
  },
  {
    id: "event",
    name: "Event Registration",
    description:
      "Form for registering for an event with personal and preference details",
    prompt:
      "Create an event registration form with name, email, phone number, dietary preferences dropdown (Vegetarian, Vegan, Non-vegetarian), and a checkbox for agreeing to terms and conditions.",
  },
  {
    id: "feedback",
    name: "Customer Feedback",
    description: "Detailed feedback form with ratings and open comments",
    prompt:
      "Create a customer feedback form with multiple choice questions for rating product quality, customer service, and delivery speed from 1-5. Include a text field for additional comments.",
  },
  {
    id: "job",
    name: "Job Application",
    description:
      "Comprehensive job application form with work history and skills",
    prompt:
      "Create a job application form with fields for personal information (name, email, phone), work experience, education, skills, and an option to upload a resume.",
  },
  {
    id: "survey",
    name: "Market Research",
    description: "Survey with diverse question types for market research",
    prompt:
      "Create a market research survey with demographic questions (age range, gender), multiple choice questions about product preferences, and rating scales for different features.",
  },
];

export function AIPromptModal() {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const router = useRouter();
  const { toast } = useToast();

  const handleSelectTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    setActiveTab("write");
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
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

            <TabsContent value="write" className="mt-4 flex flex-col h-[370px]">
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
              <div className="grid gap-4 h-[370px] overflow-y-auto pr-2">
                {PROMPT_TEMPLATES.map((template) => (
                  <Card
                    key={template.id}
                    className="p-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleSelectTemplate(template.prompt)}
                  >
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

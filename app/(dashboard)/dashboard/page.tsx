"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Form } from "@/types/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


interface FormWithStats extends Form {
  _count?: {
    responses: number;
  };
}
const templates = [
  { icon: "✍️", description: "Custom" },
  { icon: "🤠", description: "DAO Membership Application Form" },
  { icon: "🧩", description: "Product Feedback Form" },
  { icon: "🤝", description: "Booth Survey" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoaded } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [forms, setForms] = useState<FormWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCreateForm = async (template: string) => {
    if (isCreating) return;

    try {
      setIsCreating(true);
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ template }),
      });

      const newForm = await response.json();
      if (response.ok) {
        router.push(`/dashboard/forms/${newForm.id}`);
      } else {
        throw new Error("Failed to create form");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
      setIsModalOpen(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown date";
    return new Date(date).toLocaleDateString();
  };

  if (!isLoaded || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Forms</h1>
        <Button onClick={() => setIsModalOpen(true)} disabled={isCreating}>
          {isCreating ? "Creating..." : "Create New Form"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map((form) => (
          <Card key={form.id}>
            <CardHeader>
              <CardTitle>{form.title}</CardTitle>
              <CardDescription>
                Created on {formatDate(form.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
              <Link href={`/dashboard/forms/${form.id}`}>
                <Button variant="outline">Edit</Button>
              </Link>
              <Link href={`/dashboard/forms/${form.id}/responses`}>
                <Button variant="outline" size="sm">
                  Responses
                </Button>
              </Link>
              <Link href={`/forms/${form.customSlug || form.id}`}>
                <Button>View</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}

        {forms.length === 0 && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="text-center">No forms yet</CardTitle>
              <CardDescription className="text-center">
                Create your first form to get started
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button onClick={() => setIsModalOpen(true)} disabled={isCreating}>
                Create Form
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a Template</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {templates.map((template) => (
             <Card
               key={template.description}
               className="cursor-pointer"
               onClick={() => handleCreateForm(template.description)}
                >
              <CardHeader className="flex flex-col items-center justify-center h-full">
               <CardTitle className="text-4xl">{template.icon}</CardTitle>
                 <CardDescription className="text-center">
                       {template.description}
                </CardDescription>
                </CardHeader>
              </Card>
               ))}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

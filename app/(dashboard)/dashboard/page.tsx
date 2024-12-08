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
import { Trash2 } from "lucide-react";

interface FormWithStats extends Form {
  _count?: {
    responses: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoaded } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [forms, setForms] = useState<FormWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleCreateForm = async () => {
    if (isCreating) return;

    try {
      setIsCreating(true);
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    }
  };

  // New function to handle form deletion
  const handleDelete = async (formId: string) => {
    if (confirm("Are you sure you want to delete this form?")) {
      try {
        const response = await fetch(`/api/forms/${formId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Form deleted successfully",
          });

          // Convert form.id to a string for comparison
          setForms((prevForms) =>
            prevForms.filter((form) => String(form.id) !== formId)
          );
        } else {
          const errorData = await response.json();
          toast({
            title: "Error",
            description: errorData.error || "Failed to delete the form",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("[DELETE_FORM_ERROR]", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      }
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
        <Button onClick={handleCreateForm} disabled={isCreating}>
          {isCreating ? "Creating..." : "Create New Form"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map((form) => (
          <Card key={form.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{form.title}</CardTitle>
                  <CardDescription>
                    Created on {formatDate(form.createdAt)}
                  </CardDescription>
                </div>
                {/* Added delete functionality */}
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(String(form.id))}
                >
                  <Trash2 className="text-red-500" />
                </Button>
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

        {forms.length === 0 && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="text-center">No forms yet</CardTitle>
              <CardDescription className="text-center">
                Create your first form to get started
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button onClick={handleCreateForm} disabled={isCreating}>
                Create Form
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}

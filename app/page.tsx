import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Form } from "@/types/form";

async function getData(): Promise<Form[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/forms`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch forms");
    }

    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userForms = await getData();

  const formatDate = (date: string | Date | null) => {
    if (!date) return "Unknown date";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Forms</h1>
        <Link href="/dashboard/forms/new">
          <Button>Create New Form</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userForms.map((form: Form) => (
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
              <Link href={`/forms/${form.customSlug || form.id}`}>
                <Button>View</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}

        {userForms.length === 0 && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="text-center">No forms yet</CardTitle>
              <CardDescription className="text-center">
                Create your first form to get started
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Link href="/dashboard/forms/new">
                <Button>Create Form</Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}

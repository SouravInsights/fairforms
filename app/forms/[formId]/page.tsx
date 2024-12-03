// src/app/forms/[formId]/page.tsx
import { Suspense } from "react";
import { FormView } from "@/app/components/forms/FormView";
import { notFound } from "next/navigation";
import { Form } from "@/types/form";
import { Metadata } from "next";

interface FormPageProps {
  params: {
    formId: string;
  };
}

async function getForm(formId: string): Promise<Form> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not defined");
  }

  // Try to fetch form using formId (could be numeric ID or slug)
  const res = await fetch(`${baseUrl}/api/forms/${formId}/public`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 }, // Disable cache
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch form: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function generateMetadata({
  params,
}: FormPageProps): Promise<Metadata> {
  try {
    const form = await getForm(params.formId);

    return {
      title: form.metaTitle || form.title,
      description: form.metaDescription || form.description || undefined,
      openGraph: {
        title: form.metaTitle || form.title,
        description: form.metaDescription || form.description || undefined,
        images: form.socialImageUrl ? [form.socialImageUrl] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: form.metaTitle || form.title,
        description: form.metaDescription || form.description || undefined,
        images: form.socialImageUrl ? [form.socialImageUrl] : undefined,
      },
    };
  } catch {
    return {
      title: "Form",
      description: "View and submit form",
    };
  }
}

export default async function FormPage({ params }: FormPageProps) {
  const form = await getForm(params.formId);

  if (!form.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>loading...</div>}>
        <FormView form={form} />
      </Suspense>
    </div>
  );
}

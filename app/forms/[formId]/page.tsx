import { Suspense } from "react";
import { FormView } from "@/app/components/forms/FormView";
import { notFound } from "next/navigation";
import { Form } from "@/types/form";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const res = await fetch(`${baseUrl}/api/forms/${formId}/public`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    cache: "no-store",
    next: {
      revalidate: 0,
      tags: [`form-${formId}`],
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch form: ${res.statusText}`);
  }

  const data = await res.json();
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

export async function generateMetadata({
  params,
}: FormPageProps): Promise<Metadata> {
  try {
    const form = await getForm(params.formId);
    const title = form.metaTitle || "";
    const description = form.metaDescription || form.description || undefined;
    const timestamp = Date.now();
    const images = form.socialImageUrl
      ? [
          {
            url: form.socialImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ]
      : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/forms/${params.formId}`,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: form.socialImageUrl ? [form.socialImageUrl] : undefined,
        creator: "@username", // will be updated later
      },

      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/forms/${
          form.customSlug || params.formId
        }`,
      },
      robots: {
        index: form.isPublished,
        follow: form.isPublished,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
      other: {
        "og:image:cache-bust": timestamp.toString(),
        "twitter:image:cache-bust": timestamp.toString(),
      },
    };
  } catch {
    return {
      title: "Form",
      description: "View and submit form",
      robots: {
        index: false,
        follow: false,
      },
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
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            Loading...
          </div>
        }
      >
        <FormView form={form} />
      </Suspense>
    </div>
  );
}

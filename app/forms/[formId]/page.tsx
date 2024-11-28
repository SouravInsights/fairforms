import { FormView } from "@/app/components/forms/FormView";
import { getPublicForm } from "@/lib/services/form-service";
import { notFound } from "next/navigation";

interface FormPageProps {
  params: {
    formId: string;
  };
}

export default async function FormPage({ params }: FormPageProps) {
  const { data: form, error } = await getPublicForm(params.formId);

  if (error || !form) {
    notFound();
  }

  return <FormView form={form} />;
}

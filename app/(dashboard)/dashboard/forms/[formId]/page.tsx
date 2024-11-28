"use client";

import { FormBuilder } from "@/app/components/form-builder/FormBuilder";
import { FormProvider } from "@/app/context/form-context";

export default function FormBuilderPage({
  params,
}: {
  params: { formId: string };
}) {
  return (
    <FormProvider>
      <FormBuilder formId={params.formId} />
    </FormProvider>
  );
}

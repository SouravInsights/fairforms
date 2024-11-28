"use client";

import { FormProvider } from "@/app/context/form-context";
import { FormBuilder } from "@/app/components/form-builder/FormBuilder";

export default function NewFormPage() {
  return (
    <FormProvider>
      <FormBuilder formId="new" />
    </FormProvider>
  );
}

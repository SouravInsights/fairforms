/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FormElement, FormElementType } from "@/types/form";
import { TextInput } from "./TextInput";

interface FormElementProps {
  element: FormElement;
  value: any;
  onChange: (value: any) => void;
}

export function FormElement({ element, value, onChange }: FormElementProps) {
  switch (element.type) {
    case FormElementType.SHORT_TEXT:
      return <TextInput element={element} value={value} onChange={onChange} />;
    default:
      return null;
  }
}

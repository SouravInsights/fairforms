import {
  type FormElement,
  FormElementType,
  FormElementValue,
} from "@/types/form";
import { TextInput } from "./TextInput";
import { EmailInput } from "./EmailInput";
import { Statement } from "./Statement";
import { MultipleChoiceInput } from "./MultipleChoiceInput";
import { PhoneInput } from "./PhoneInput";
import { AddressInput } from "./AddressInput";
import { WebsiteInput } from "./WebsiteInput";
import { DropdownInput } from "./DropdownInput";
import { PictureChoice } from "./PictureChoice";
import { TextArea } from "./TextArea";
import { NumberInput } from "./NumberInput";
import { DateInput } from "./DateInput";
import { FileUpload } from "./FileUpload";

interface FormElementProps {
  element: FormElement;
  value: FormElementValue;
  onChange: (value: FormElementValue) => void;
}

export function FormElement({ element, value, onChange }: FormElementProps) {
  switch (element.type) {
    case FormElementType.SHORT_TEXT:
      return (
        <TextInput
          element={element}
          value={value as string}
          onChange={onChange}
        />
      );
    case FormElementType.LONG_TEXT:
      return (
        <TextArea
          element={element}
          value={value as string}
          onChange={onChange}
        />
      );
    case FormElementType.EMAIL:
      return (
        <EmailInput
          element={element}
          value={value as string}
          onChange={onChange}
        />
      );
    case FormElementType.PHONE:
      return (
        <PhoneInput
          element={element}
          value={value as { countryCode: string; number: string }}
          onChange={onChange}
        />
      );
    case FormElementType.ADDRESS:
      return (
        <AddressInput
          element={element}
          value={
            value as {
              street: string;
              apartment?: string;
              city: string;
              state: string;
              zipCode: string;
              country?: string;
            }
          }
          onChange={onChange}
        />
      );
    case FormElementType.WEBSITE:
      return (
        <WebsiteInput
          element={element}
          value={value as string}
          onChange={onChange}
        />
      );
    case FormElementType.MULTIPLE_CHOICE:
      return (
        <MultipleChoiceInput
          element={element}
          value={value as string | string[]}
          onChange={onChange}
        />
      );
    case FormElementType.DROPDOWN:
      return (
        <DropdownInput
          element={element}
          value={value as string}
          onChange={onChange}
        />
      );
    case FormElementType.PICTURE_CHOICE:
      return (
        <PictureChoice
          element={element}
          value={value as string | string[]}
          onChange={onChange}
        />
      );
    case FormElementType.NUMBER:
      return (
        <NumberInput
          element={element}
          value={value as number}
          onChange={onChange}
        />
      );
    case FormElementType.DATE:
      return (
        <DateInput
          element={element}
          value={value as Date}
          onChange={onChange}
        />
      );
    case FormElementType.FILE_UPLOAD:
      return (
        <FileUpload
          element={element}
          value={value as File[]}
          onChange={onChange}
        />
      );
    case FormElementType.STATEMENT:
      return <Statement element={element} />;
    default:
      return null;
  }
}

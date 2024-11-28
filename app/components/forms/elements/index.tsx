import { type FormElement, FormElementType } from "@/types/form";
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
  value: any;
  onChange: (value: any) => void;
}

export function FormElement({ element, value, onChange }: FormElementProps) {
  switch (element.type) {
    case FormElementType.SHORT_TEXT:
      return <TextInput element={element} value={value} onChange={onChange} />;
    case FormElementType.LONG_TEXT:
      return <TextArea element={element} value={value} onChange={onChange} />;
    case FormElementType.EMAIL:
      return <EmailInput element={element} value={value} onChange={onChange} />;
    case FormElementType.PHONE:
      return <PhoneInput element={element} value={value} onChange={onChange} />;
    case FormElementType.ADDRESS:
      return (
        <AddressInput element={element} value={value} onChange={onChange} />
      );
    case FormElementType.WEBSITE:
      return (
        <WebsiteInput element={element} value={value} onChange={onChange} />
      );
    case FormElementType.MULTIPLE_CHOICE:
      return (
        <MultipleChoiceInput
          element={element}
          value={value}
          onChange={onChange}
        />
      );
    case FormElementType.DROPDOWN:
      return (
        <DropdownInput element={element} value={value} onChange={onChange} />
      );
    case FormElementType.PICTURE_CHOICE:
      return (
        <PictureChoice element={element} value={value} onChange={onChange} />
      );
    case FormElementType.NUMBER:
      return (
        <NumberInput element={element} value={value} onChange={onChange} />
      );
    case FormElementType.DATE:
      return <DateInput element={element} value={value} onChange={onChange} />;
    case FormElementType.FILE_UPLOAD:
      return <FileUpload element={element} value={value} onChange={onChange} />;
    case FormElementType.STATEMENT:
      return <Statement element={element} />;
    default:
      return null;
  }
}

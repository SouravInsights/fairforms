import {
  Form,
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
import { WelcomeScreen } from "./WelcomeScreen";
import { EndScreen } from "./EndScreen";
import { ContactInfo } from "./ContactInfo";

interface FormElementProps {
  element: FormElement;
  value: FormElementValue;
  onChange: (value: FormElementValue) => void;
  theme: Form["settings"]["theme"];
}

export function FormElement({
  element,
  value,
  onChange,
  theme,
}: FormElementProps) {
  switch (element.type) {
    case FormElementType.SHORT_TEXT:
      return (
        <TextInput
          element={element}
          value={value as string}
          onChange={onChange}
          theme={theme}
        />
      );
    case FormElementType.LONG_TEXT:
      return (
        <TextArea
          element={element}
          value={value as string}
          onChange={onChange}
          theme={theme}
        />
      );
    case FormElementType.EMAIL:
      return (
        <EmailInput
          element={element}
          value={value as string}
          onChange={onChange}
          theme={theme}
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
          theme={theme}
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

    case FormElementType.WELCOME_SCREEN:
      return (
        <WelcomeScreen element={element} onChange={onChange} theme={theme} />
      );
    case FormElementType.END_SCREEN:
      return <EndScreen element={element} onChange={onChange} />;
    case FormElementType.CONTACT_INFO:
      return (
        <ContactInfo
          element={element}
          value={
            value as {
              firstName: string;
              lastName: string;
              middleName?: string;
            }
          }
          onChange={onChange}
          theme={theme}
        />
      );
    default:
      return null;
  }
}

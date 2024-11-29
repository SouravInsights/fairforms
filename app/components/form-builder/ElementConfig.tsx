import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
  List,
  ArrowDownToLine,
  Image,
  AlignLeft,
  TextQuote,
  Hash,
  Calendar,
  Upload,
  Waves,
  MessageSquare,
  Flag,
  ExternalLink,
} from "lucide-react";
import { FormElementType } from "@/types/form";

export const ELEMENT_GROUPS = {
  "Contact Info": [
    {
      type: FormElementType.CONTACT_INFO,
      icon: UserCircle,
      label: "Contact Info",
    },
    {
      type: FormElementType.EMAIL,
      icon: Mail,
      label: "Email",
    },
    {
      type: FormElementType.PHONE,
      icon: Phone,
      label: "Phone",
    },
    {
      type: FormElementType.ADDRESS,
      icon: MapPin,
      label: "Address",
    },
    {
      type: FormElementType.WEBSITE,
      icon: Globe,
      label: "Website",
    },
  ],
  Choice: [
    {
      type: FormElementType.MULTIPLE_CHOICE,
      icon: List,
      label: "Multiple Choice",
    },
    {
      type: FormElementType.DROPDOWN,
      icon: ArrowDownToLine,
      label: "Dropdown",
    },
    {
      type: FormElementType.PICTURE_CHOICE,
      icon: Image,
      label: "Picture Choice",
    },
  ],
  Text: [
    {
      type: FormElementType.LONG_TEXT,
      icon: AlignLeft,
      label: "Long Text",
    },
    {
      type: FormElementType.SHORT_TEXT,
      icon: TextQuote,
      label: "Short Text",
    },
  ],
  Other: [
    {
      type: FormElementType.NUMBER,
      icon: Hash, // Changed from Numbers to Hash
      label: "Number",
    },
    {
      type: FormElementType.DATE,
      icon: Calendar,
      label: "Date",
    },
    {
      type: FormElementType.FILE_UPLOAD,
      icon: Upload,
      label: "File Upload",
    },
    {
      type: FormElementType.WELCOME_SCREEN,
      icon: Waves, // Changed from Wave to Waves
      label: "Welcome Screen",
    },
    {
      type: FormElementType.STATEMENT,
      icon: MessageSquare,
      label: "Statement",
    },
    {
      type: FormElementType.END_SCREEN,
      icon: Flag,
      label: "End Screen",
    },
    {
      type: FormElementType.REDIRECT,
      icon: ExternalLink,
      label: "Redirect",
    },
  ],
} as const;

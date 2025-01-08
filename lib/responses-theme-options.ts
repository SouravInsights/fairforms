export const colorSchemes = {
  neutral: {
    name: "Neutral",
    bg: "bg-white",
    card: "bg-white border-gray-200",
    text: "text-gray-900",
    muted: "text-gray-500",
    headerBg: "bg-gray-50",
    borderdivider: "border-gray-100",
    rowHover: "hover:bg-gray-50",
  },
  rose: {
    name: "Rose",
    bg: "bg-rose-50",
    card: "bg-white border-rose-200",
    text: "text-rose-950",
    muted: "text-rose-600",
    headerBg: "bg-rose-50",
    borderdivider: "border-rose-100",
    rowHover: "hover:bg-rose-50",
  },
  sky: {
    name: "Sky",
    bg: "bg-sky-50",
    card: "bg-white border-sky-200",
    text: "text-sky-950",
    muted: "text-sky-600",
    headerBg: "bg-sky-50",
    borderdivider: "border-sky-100",
    rowHover: "hover:bg-sky-50",
  },
  violet: {
    name: "Violet",
    bg: "bg-violet-50",
    card: "bg-white border-violet-200",
    text: "text-violet-950",
    muted: "text-violet-600",
    headerBg: "bg-violet-50",
    borderdivider: "border-violet-100",
    rowHover: "hover:bg-violet-50",
  },
} as const;

export type ColorSchemeName = keyof typeof colorSchemes;

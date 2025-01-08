export const colorSchemes = {
  // Light Themes
  lavenderMist: {
    name: "Lavender Mist",
    bg: "bg-[#F5F3FF]",
    text: "text-[#27272A]",
    muted: "text-[#4C1D95]",
    card: "bg-white",
    borderdivider: "border-[#EDE9FE]",
    headerBg: "bg-[#F5F3FF]",
    rowHover: "hover:bg-[#EDE9FE]",
  },
  oceanBreeze: {
    name: "Ocean Breeze",
    bg: "bg-[#F0F9FF]",
    text: "text-[#27272A]",
    muted: "text-[#0C4A6E]",
    card: "bg-white",
    borderdivider: "border-[#E0F2FE]",
    headerBg: "bg-[#F0F9FF]",
    rowHover: "hover:bg-[#E0F2FE]",
  },

  // Neon/Dark Themes
  neonNight: {
    name: "Neon Night",
    bg: "bg-[#1A202C]",
    text: "text-[#E2E8F0]",
    muted: "text-[#F472B6]",
    card: "bg-[#10151B]",
    borderdivider: "border-[#10151B]",
    headerBg: "bg-[#1A202C]",
    rowHover: "hover:bg-[#10151B]",
  },

  // Dark Themes
  midnightPurple: {
    name: "Midnight Purple",
    bg: "bg-[#2D1B69]",
    text: "text-[#E2E8F0]",
    muted: "text-[#F8FAFC]",
    card: "bg-[#1E1B4B]",
    borderdivider: "border-[#1E1B4B]",
    headerBg: "bg-[#2D1B69]",
    rowHover: "hover:bg-[#1E1B4B]",
  },
  cherryNoir: {
    name: "Cherry Noir",
    bg: "bg-[#27141E]",
    text: "text-[#E2E8F0]",
    muted: "text-[#F9FAFB]",
    card: "bg-[#1A0F15]",
    borderdivider: "border-[#1A0F15]",
    headerBg: "bg-[#27141E]",
    rowHover: "hover:bg-[#1A0F15]",
  },
} as const;

export type ColorSchemeName = keyof typeof colorSchemes;

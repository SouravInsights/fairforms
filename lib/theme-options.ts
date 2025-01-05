export interface ThemeOption {
  id: string;
  name: string;
  colors: {
    primaryColor: string;
    backgroundColor: string;
    questionColor: string;
    textColor: string;
    sidebarColor: string; // For the left sidebar background
  };
  description: string;
  mode: "light" | "dark";
}

export const themeOptions: ThemeOption[] = [
  // Light Themes
  {
    id: "rose-gold",
    name: "Rose Gold",
    colors: {
      primaryColor: "#EC4899",
      backgroundColor: "#FDF2F8",
      questionColor: "#831843",
      textColor: "#27272A",
      sidebarColor: "#FFF1F2",
    },
    description: "Elegant and feminine with soft pink tones",
    mode: "light",
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    colors: {
      primaryColor: "#8B5CF6",
      backgroundColor: "#F5F3FF",
      questionColor: "#4C1D95",
      textColor: "#27272A",
      sidebarColor: "#F3F4F6",
    },
    description: "Calming purple hues for a serene experience",
    mode: "light",
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    colors: {
      primaryColor: "#0EA5E9",
      backgroundColor: "#F0F9FF",
      questionColor: "#0C4A6E",
      textColor: "#27272A",
      sidebarColor: "#F1F5F9",
    },
    description: "Fresh and airy blue tones",
    mode: "light",
  },
  // Dark Themes
  {
    id: "midnight",
    name: "Midnight",
    colors: {
      primaryColor: "#60A5FA",
      backgroundColor: "#1E293B",
      questionColor: "#F8FAFC",
      textColor: "#E2E8F0",
      sidebarColor: "#0F172A",
    },
    description: "Professional dark theme with blue accents",
    mode: "dark",
  },
  {
    id: "dark-purple",
    name: "Dark Purple",
    colors: {
      primaryColor: "#A78BFA",
      backgroundColor: "#2D1B69",
      questionColor: "#F8FAFC",
      textColor: "#E2E8F0",
      sidebarColor: "#1E1B4B",
    },
    description: "Rich purple tones with elegant contrast",
    mode: "dark",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    colors: {
      primaryColor: "#10B981",
      backgroundColor: "#18181B",
      questionColor: "#F8FAFC",
      textColor: "#E2E8F0",
      sidebarColor: "#27272A",
    },
    description: "Minimalist dark theme with green accents",
    mode: "dark",
  },
  {
    id: "dark-rose",
    name: "Dark Rose",
    colors: {
      primaryColor: "#F472B6", // Bright pink for accents
      backgroundColor: "#2D1A2E", // Deep rose/plum background
      questionColor: "#F9FAFB", // Almost white for questions
      textColor: "#E2E8F0", // Light gray for regular text
      sidebarColor: "#1F1420", // Slightly darker shade for sidebar
    },
    description: "Elegant dark theme with rose accents",
    mode: "dark",
  },
  {
    id: "midnight-rose",
    name: "Midnight Rose",
    colors: {
      primaryColor: "#EC4899", // Hot pink for accents
      backgroundColor: "#1E1B2D", // Dark purple-ish background
      questionColor: "#F9FAFB", // Almost white for questions
      textColor: "#E2E8F0", // Light gray for regular text
      sidebarColor: "#171522", // Slightly darker sidebar
    },
    description: "Deep midnight theme with vibrant pink accents",
    mode: "dark",
  },
  {
    id: "cherry-noir",
    name: "Cherry Noir",
    colors: {
      primaryColor: "#FB7185", // Light coral pink
      backgroundColor: "#27141E", // Very dark cherry
      questionColor: "#F9FAFB", // Almost white for questions
      textColor: "#E2E8F0", // Light gray for regular text
      sidebarColor: "#1A0F15", // Darker cherry for sidebar
    },
    description: "Rich dark cherry theme with coral accents",
    mode: "dark",
  },
  {
    id: "rose-velvet",
    name: "Rose Velvet",
    colors: {
      primaryColor: "#F9A8D4", // Soft pink
      backgroundColor: "#231526", // Dark rose background
      questionColor: "#F9FAFB", // Almost white for questions
      textColor: "#E2E8F0", // Light gray for regular text
      sidebarColor: "#1A1019", // Darker shade for sidebar
    },
    description: "Luxurious dark theme with soft pink touches",
    mode: "dark",
  },
];

export function needsLightText(backgroundColor: string): boolean {
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

export interface ThemeOption {
  id: string;
  name: string;
  colors: {
    primaryColor: string;
    backgroundColor: string;
    questionColor: string;
  };
  description: string;
}

export const themeOptions: ThemeOption[] = [
  {
    id: "rose-gold",
    name: "Rose Gold",
    colors: {
      primaryColor: "#EC4899",
      backgroundColor: "#FDF2F8",
      questionColor: "#831843",
    },
    description: "Elegant and feminine with soft pink tones",
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    colors: {
      primaryColor: "#8B5CF6",
      backgroundColor: "#F5F3FF",
      questionColor: "#4C1D95",
    },
    description: "Calming purple hues for a serene experience",
  },
  {
    id: "coastal-breeze",
    name: "Coastal Breeze",
    colors: {
      primaryColor: "#0EA5E9",
      backgroundColor: "#F0F9FF",
      questionColor: "#0C4A6E",
    },
    description: "Fresh and airy blue tones",
  },
  {
    id: "sage-garden",
    name: "Sage Garden",
    colors: {
      primaryColor: "#10B981",
      backgroundColor: "#ECFDF5",
      questionColor: "#064E3B",
    },
    description: "Peaceful green inspired by nature",
  },
  {
    id: "warm-peach",
    name: "Warm Peach",
    colors: {
      primaryColor: "#F97316",
      backgroundColor: "#FFF7ED",
      questionColor: "#7C2D12",
    },
    description: "Warm and inviting peachy tones",
  },
  {
    id: "classic",
    name: "Classic",
    colors: {
      primaryColor: "#0F172A",
      backgroundColor: "#FFFFFF",
      questionColor: "#0F172A",
    },
    description: "Timeless and professional design",
  },
];

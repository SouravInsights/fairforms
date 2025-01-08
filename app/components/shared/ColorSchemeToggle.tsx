import { motion } from "motion/react";
import { Palette } from "lucide-react"; // You can replace this with any other icon
import { colorSchemes, ColorSchemeName } from "@/lib/responses-theme-options";

interface ColorSchemeToggleProps {
  activeScheme: ColorSchemeName;
  onChange: (scheme: ColorSchemeName) => void;
}

export function ColorSchemeToggle({
  activeScheme,
  onChange,
}: ColorSchemeToggleProps) {
  const schemes = Object.entries(colorSchemes);

  // Function to cycle through themes
  const cycleNextTheme = () => {
    const currentIndex = schemes.findIndex(([key]) => key === activeScheme);
    const nextIndex = (currentIndex + 1) % schemes.length;
    onChange(schemes[nextIndex][0] as ColorSchemeName);
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.button
        onClick={cycleNextTheme}
        className={`
          w-12 h-12 rounded-full
          border-2 ${colorSchemes[activeScheme].bg}
          transition-all duration-300
          hover:ring-2 hover:ring-blue-400
          flex items-center justify-center
        `}
        aria-label="Cycle through color schemes"
        whileHover={{
          scale: 1.2,
          rotate: 15,
          transition: { duration: 0.2 },
        }}
        whileTap={{
          scale: 0.9,
          rotate: -10,
          transition: { duration: 0.1 },
        }}
      >
        <motion.div
          key={activeScheme} // This will force the icon to change with animation
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Palette className={`w-6 h-6 ${colorSchemes[activeScheme].text}`} />
        </motion.div>
      </motion.button>
    </motion.div>
  );
}

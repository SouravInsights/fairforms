import { FormElement, FormElementType, FormElementValue } from "@/types/form";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Twitter, Linkedin } from "lucide-react";

interface EndScreenProps {
  element: FormElement & { type: FormElementType.END_SCREEN };
  onChange: (value: FormElementValue) => void;
}

export function EndScreen({ element, onChange }: EndScreenProps) {
  return (
    <div className="text-center space-y-6">
      <motion.h2
        className="text-4xl md:text-5xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {element.properties.title}
      </motion.h2>

      <motion.p
        className="text-xl text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {element.properties.message}
      </motion.p>

      {element.properties.buttonText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={() => onChange(true)} size="lg" className="mt-4">
            {element.properties.buttonText}
          </Button>
        </motion.div>
      )}

      {element.properties.showSocialShare && (
        <motion.div
          className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button variant="outline" size="lg" className="space-x-2">
            <Twitter className="h-5 w-5" />
            <span>Share on Twitter</span>
          </Button>
          <Button variant="outline" size="lg" className="space-x-2">
            <Linkedin className="h-5 w-5" />
            <span>Share on LinkedIn</span>
          </Button>
        </motion.div>
      )}
    </div>
  );
}

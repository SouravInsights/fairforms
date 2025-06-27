import { motion } from "motion/react";
import { Loader2, CheckCircle2 } from "lucide-react";

interface FormLoadingStateProps {
  isSubmitting: boolean;
  isSuccess: boolean;
}

export function FormLoadingState({
  isSubmitting,
  isSuccess,
}: FormLoadingStateProps) {
  if (isSubmitting && !isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold">
            Submitting your response...
          </h3>
        </motion.div>
      </motion.div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1.2, 1],
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            times: [0, 0.2, 1],
          }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
          >
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
          </motion.div>
          <h3 className="text-2xl font-semibold">Response submitted!</h3>
          <p className="text-muted-foreground mt-2">
            Thank you for your time.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return null;
}

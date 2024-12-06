import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { useState } from "react";
import { Form, FormSettings } from "@/types/form";
import { Web3Settings } from "./Web3Settings";
import { useWeb3Status } from "@/app/hooks/use-web3-status";

interface Web3DialogProps {
  form: Form;
  onUpdate: (updates: Partial<Form>) => Promise<void>;
}

const defaultWeb3Settings: FormSettings["web3"] = {
  enabled: false,
  tokenGating: {
    enabled: false,
    chainId: 1,
    tokenType: "ERC20",
  },
  rewards: {
    enabled: false,
    chainId: 1,
  },
};

export function Web3Dialog({ form, onUpdate }: Web3DialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useWeb3Status();

  console.log("isConnected from Web3Dialog:", isConnected);
  const handleUpdate = async (web3Settings: FormSettings["web3"]) => {
    try {
      await onUpdate({
        settings: {
          ...form.settings,
          web3: web3Settings,
        },
      });
      setIsOpen(false);
    } catch {
      // Error is handled by the parent component
    }
  };

  // Ensure we always have web3 settings, using defaults if needed
  const currentWeb3Settings = form.settings.web3 || defaultWeb3Settings;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Web3 Settings {isConnected && "✓"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Web3 Settings</DialogTitle>
          <DialogDescription>
            Configure token gating and rewards for your form
          </DialogDescription>
        </DialogHeader>

        <Web3Settings settings={currentWeb3Settings} onUpdate={handleUpdate} />
      </DialogContent>
    </Dialog>
  );
}

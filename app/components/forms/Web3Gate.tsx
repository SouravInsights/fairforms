import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface Web3GateProps {
  isConnected: boolean;
  hasAccess: bigint | boolean | undefined;
  minTokenBalance?: number;
  onConnect: () => void;
}

export function Web3Gate({
  isConnected,
  hasAccess,
  minTokenBalance,
  onConnect,
}: Web3GateProps) {
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <h1 className="text-2xl font-bold text-center">Connect Wallet</h1>
        <p className="text-center text-muted-foreground">
          You need to connect your wallet to access this form.
        </p>
        <Button onClick={onConnect}>
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <h1 className="text-2xl font-bold text-center">Access Required</h1>
        <p className="text-center text-muted-foreground">
          You need to hold at least {minTokenBalance} tokens to access this
          form.
        </p>
      </div>
    );
  }

  return null;
}

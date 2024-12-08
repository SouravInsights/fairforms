import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { TokenMinter } from "./TokenMinter";

interface Web3GateProps {
  isConnected: boolean;
  hasAccess: boolean;
  minTokenBalance?: number;
  onConnect: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Web3Gate({
  isConnected,
  hasAccess,
  minTokenBalance = 0,
  onConnect,
  isLoading = false,
  children,
}: Web3GateProps) {
  const isDevelopment = true;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-center text-muted-foreground">
          Checking wallet access...
        </p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <h1 className="text-2xl font-bold text-center">Connect Wallet</h1>
        <p className="text-center text-muted-foreground max-w-md">
          This form requires wallet connection to verify token ownership. Please
          connect your wallet to continue.
        </p>
        <Button onClick={onConnect} size="lg">
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
        <p className="text-center text-muted-foreground max-w-md">
          This form requires you to hold at least {minTokenBalance} token
          {minTokenBalance !== 1 ? "s" : ""} to access. Please make sure you
          have the required tokens in your wallet.
        </p>

        {/* Show minter in development */}
        {isDevelopment && (
          <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-2">
              Get Test Tokens
            </p>
            <TokenMinter />
          </div>
        )}
      </div>
    );
  }

  return children;
}

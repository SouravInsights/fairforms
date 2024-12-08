import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Loader2, Wallet, Coins } from "lucide-react";
import { useClaimTestTokens } from "@/app/hooks/use-claim-test-tokens";
import { useToast } from "@/hooks/use-toast";

interface TokenGateCheckProps {
  isConnected: boolean;
  minTokenBalance: number;
  contractAddress: string;
}

export function TokenGateCheck({
  isConnected,
  minTokenBalance,
  contractAddress,
}: TokenGateCheckProps) {
  const { connect } = useConnect();
  const { claimTestTokens, isClaiming } = useClaimTestTokens(contractAddress);
  const { toast } = useToast();

  const handleClaim = async () => {
    try {
      const { hash } = await claimTestTokens();
      toast({
        title: "Success",
        description: (
          <div className="flex flex-col gap-2">
            <p>Test tokens claimed successfully!</p>
            <a
              href={`https://sepolia.basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View transaction
            </a>
          </div>
        ),
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to claim test tokens. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6">
          <div className="text-center space-y-4">
            <Wallet className="h-12 w-12 mx-auto text-primary" />
            <h2 className="text-2xl font-semibold">Connect Wallet</h2>
            <p className="text-muted-foreground">
              Please connect your wallet to access this form
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={() => connect({ connector: injected() })}
            >
              Connect Wallet
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6">
        <div className="text-center space-y-6">
          <Coins className="h-12 w-12 mx-auto text-primary" />
          <h2 className="text-2xl font-semibold">Access Required</h2>
          <p className="text-muted-foreground mb-4">
            You need at least {minTokenBalance} tokens to access this form
          </p>
          <Button
            size="lg"
            className="w-full"
            onClick={handleClaim}
            disabled={isClaiming}
          >
            {isClaiming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : (
              "Claim Test Tokens"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

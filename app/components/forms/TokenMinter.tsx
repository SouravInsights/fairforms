"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useChainId, useSwitchChain } from "wagmi";
import { baseSepolia } from "viem/chains";

export function TokenMinter() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [amount, setAmount] = useState("10");
  const [isLoading, setIsLoading] = useState(false);

  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const getTokens = async () => {
    if (!address) return;

    try {
      setIsLoading(true);

      // Check network
      if (chainId !== baseSepolia.id) {
        switchChain({ chainId: baseSepolia.id });
      }

      const response = await fetch("/api/tokens/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          amount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get tokens");
      }

      const { hash } = await response.json();

      toast({
        title: "Success",
        description: `Tokens sent! Transaction: ${hash}`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to get tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-32"
      />
      <Button onClick={getTokens} disabled={isLoading}>
        {isLoading ? "Processing..." : "Get Test Tokens"}
      </Button>
    </div>
  );
}

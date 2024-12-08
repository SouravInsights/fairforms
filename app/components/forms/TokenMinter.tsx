"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { parseEther } from "viem";
import { FORM_REWARDS_ABI } from "@/lib/contracts/abi";

interface TokenMinterProps {
  contractAddress: string;
}

export function TokenMinter({ contractAddress }: TokenMinterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const { toast } = useToast();

  const getTokens = async () => {
    if (!address || isLoading) return;

    try {
      setIsLoading(true);

      const hash = writeContract({
        address: contractAddress as `0x${string}`,
        abi: FORM_REWARDS_ABI,
        functionName: "claimReward",
        args: [parseEther("100")],
      });

      toast({
        title: "Success",
        description: `Tokens minted! Transaction: ${hash}`,
      });
    } catch (error) {
      console.error("Mint error:", error);
      toast({
        title: "Error",
        description: "Failed to get tokens",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={getTokens} disabled={isLoading}>
        {isLoading ? "Getting Tokens..." : "Get Test Tokens"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Contract: {contractAddress}
      </p>
    </div>
  );
}

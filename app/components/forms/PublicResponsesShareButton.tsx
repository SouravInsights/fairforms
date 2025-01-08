"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PublicResponsesShareButtonProps {
  formId: string;
}

export function PublicResponsesShareButton({
  formId,
}: PublicResponsesShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/forms/${formId}/share`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate share link");
      }

      const { shareUrl } = await response.json();
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Share link copied!",
        description:
          "The public responses link has been copied to your clipboard.",
      });
    } catch (error) {
      console.error("Error generating share link:", error);
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleShare} disabled={isLoading}>
      <Share2 className="mr-2 h-4 w-4" />
      {isLoading ? "Generating..." : "Share Responses"}
    </Button>
  );
}

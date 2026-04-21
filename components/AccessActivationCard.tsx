"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AccessActivationCardProps {
  sessionId: string;
}

export function AccessActivationCard({ sessionId }: AccessActivationCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/access/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Unable to verify your purchase yet.");
      }

      router.push("/recovery");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Activation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-[#3fb950]/40 bg-[#122017]">
      <CardHeader>
        <CardTitle>Purchase Detected</CardTitle>
        <CardDescription>
          Your Stripe checkout session was detected. Click activate to unlock the recovery tool on this device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={activate} disabled={isLoading}>
          {isLoading ? "Verifying Purchase..." : "Activate Access"}
        </Button>
        {error && <p className="text-sm text-[#ffb4af]">{error}</p>}
      </CardContent>
    </Card>
  );
}

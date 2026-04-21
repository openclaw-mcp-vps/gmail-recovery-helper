"use client";

import Link from "next/link";
import { ArrowRightIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

import type { RecoveryMethod } from "@/types/recovery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface RecoveryMethodCardProps {
  method: RecoveryMethod;
  rank: number;
}

export function RecoveryMethodCard({ method, rank }: RecoveryMethodCardProps) {
  return (
    <Card className="border-[#2b3644] bg-[#111827]/70">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Badge variant={rank === 1 ? "default" : "secondary"}>{rank === 1 ? "Best first step" : `Option ${rank}`}</Badge>
          <span className="text-xs text-[#9ca3af]">{method.successWindow}</span>
        </div>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheckIcon className="h-5 w-5 text-[#3fb950]" />
          {method.title}
        </CardTitle>
        <CardDescription>{method.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="text-[#d1d5db]">{method.rationale}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Difficulty: {method.difficulty}</Badge>
          <Badge variant="outline">Requirements: {method.requirements.length}</Badge>
          <Badge variant="outline">Actions: {method.steps.length}</Badge>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <span className="text-xs text-[#9ca3af]">Follow this path exactly before moving to the next option.</span>
        <Button asChild variant="secondary" size="sm">
          <Link href={`/recovery/${method.id}`}>
            Open Guide
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

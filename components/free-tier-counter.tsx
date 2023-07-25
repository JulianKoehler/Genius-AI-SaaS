"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MAX_FREE_PROMPTS } from "@/constants";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/useProModal";

type Props = {
  apiLimitCount: number;
  isPro: boolean;
};

const FreeTierCounter = ({ apiLimitCount = 0, isPro = false }: Props) => {
  const proModal = useProModal();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isPro) return null;

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {apiLimitCount} / {MAX_FREE_PROMPTS} Free Prompts
            </p>
            <Progress
              className="h-3"
              value={(apiLimitCount / MAX_FREE_PROMPTS) * 100}
            />
          </div>
          <Button
            onClick={proModal.onOpen}
            variant="upgrade"
            className="w-full">
            Upgrade <Zap className="w-4 h-4 fill-white ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeTierCounter;

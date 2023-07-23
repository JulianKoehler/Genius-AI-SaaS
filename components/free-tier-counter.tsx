"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MAX_FREE_PROMPTS } from "@/constants";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

type Props = {
  apiLimitCount: number;
};

const FreeTierCounter = ({ apiLimitCount = 0 }: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

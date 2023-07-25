"use client";

import { useState } from "react";
import axios from "axios";
import { Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  isPro: boolean;
};

const SubscriptionButton = ({ isPro = false }: Props) => {
  const [isLoading, setLoading] = useState(false);
  const onManageSubscription = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/stripe");

      window.location.href = data.url;
    } catch (error) {
      console.log("[BILLING_ERROR]", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      disabled={isLoading}
      onClick={onManageSubscription}
      variant={isPro ? "default" : "upgrade"}>
      {isPro ? "Manage Subscription" : "Upgrade"}
      {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
    </Button>
  );
};

export default SubscriptionButton;

"use client";

import { useState } from "react";
import axios from "axios";
import { Zap } from "lucide-react";
import { BeatLoader } from "react-spinners";
import toast from "react-hot-toast";

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
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      disabled={isLoading}
      onClick={onManageSubscription}
      className="min-w-[8rem]"
      variant={isPro ? "default" : "upgrade"}>
      {isLoading ? "" : isPro ? "Manage Subscription" : "Upgrade"}
      {!isPro && !isLoading && <Zap className="w-4 h-4 ml-2 fill-white" />}
      {isLoading && (
        <BeatLoader
          size={6}
          color="white"
        />
      )}
    </Button>
  );
};

export default SubscriptionButton;

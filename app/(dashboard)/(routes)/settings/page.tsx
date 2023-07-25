import Heading from "@/components/heading";
import SubscriptionButton from "@/components/subscription-button";
import { hasValidSubscription } from "@/lib/subscription";
import { Settings } from "lucide-react";
import React from "react";

type Props = {};

const SettingsPage = async (props: Props) => {
  const isPro = await hasValidSubscription();
  return (
    <div>
      <Heading
        title="Settings"
        description="Manage Account Settings"
        Icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">{`You are currently on a ${isPro ? "pro" : "free"} plan.`}</div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default SettingsPage;

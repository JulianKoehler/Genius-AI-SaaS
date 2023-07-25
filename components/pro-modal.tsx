"use client";

import { useState } from "react";
import axios from "axios";
import { Check, Zap } from "lucide-react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProModal } from "@/hooks/useProModal";
import { Badge } from "@/components/ui/badge";
import routes from "@/lib/routes";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BeatLoader } from "react-spinners";

type Props = {};

const ProModal = (props: Props) => {
  const proModal = useProModal();
  const [isLoading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/stripe");

      window.location.href = data.url;
    } catch (error: any) {
      console.log("[STRIPE_CLIENT_ERROR]", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={proModal.isOpen}
      onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              Upgrade to Genius
              <Badge
                variant="premium"
                className="uppercase text-sm p<-1">
                pro
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {routes
              .filter(route => route.isTool)
              .map(tool => (
                <Card
                  key={tool.label}
                  className="p-3 border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-x-4">
                    <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                      <tool.icon className={cn("w-6 h-6", tool.color)} />
                    </div>
                    <div className="font-semibold text-sm">{tool.label}</div>
                  </div>
                  <Check className="text-primary w-5 h-5" />
                </Card>
              ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={onSubscribe}
            size="lg"
            variant="upgrade"
            className="w-full">
            {isLoading ? (
              <BeatLoader
                size={8}
                color="white"
              />
            ) : (
              <>
                <span>Upgrade</span> <Zap className="w-4 h-4 ml-2 fill-white" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;

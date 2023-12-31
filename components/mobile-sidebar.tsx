"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";

type Props = {
  apiLimitCount: number;
  isPro: boolean;
};

const MobileSidebar = ({ apiLimitCount, isPro = false }: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          variant="ghost"
          className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0">
        <Sidebar
          apiLimitCount={apiLimitCount}
          isPro={isPro}
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;

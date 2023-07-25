import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  imagePage?: boolean;
};

const LoadingComponent = ({ imagePage = false }: Props) => {
  return (
    <div className={cn(imagePage ? "p-20" : "p-8 rounded-lg w-full flex items-center justify-center bg-muted")}>
      <div className="h-full flex flex-col gap-y-4 items-center">
        <div className="w-10 h-10 relative animate-spin">
          <Image
            alt="logo"
            fill
            src="/logo.png"
          />
        </div>
        <p className="text-sm text-muted-foreground">Genius is thinking...</p>
      </div>
    </div>
  );
};

export default LoadingComponent;

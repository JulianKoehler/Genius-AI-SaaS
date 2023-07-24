"use client";

import { useEffect, useState } from "react";
import ProModal from "./pro-modal";

export const ModalProvider = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <ProModal />
    </>
  );
};

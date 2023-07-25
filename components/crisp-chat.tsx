"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("a21e6414-11d1-4e60-a26e-bbf4674a76df");
  });
  return null;
};

export default CrispChat;

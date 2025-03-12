import { useState, useEffect } from "react";


export const useMiniOrderCardMobile = (): boolean => {
  const [isMini, setIsMini] = useState<boolean>(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMini(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMini;
};

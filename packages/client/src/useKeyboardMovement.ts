import { useEffect } from "react";
import { useMUD } from "./MUDContext";

export const useKeyboardMovement = () => {
  // assume mapId is padded to 32 bytes
  const {
    systemCalls: { moveBy },
  } = useMUD();

  useEffect(() => {
    const mapId = '0x0000000000000000000000000000000000000000000000000000000000000001'
  
    const listener = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        moveBy(mapId, 0, -1);
      }
      if (e.key === "ArrowDown") {
        moveBy(mapId, 0, 1);
      }
      if (e.key === "ArrowLeft") {
        moveBy(mapId, -1, 0);
      }
      if (e.key === "ArrowRight") {
        moveBy(mapId, 1, 0);
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [moveBy]);
};

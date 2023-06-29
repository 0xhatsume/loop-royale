import { useEffect } from "react";
import { useMUD } from "../MUDContext";
import { useAccount } from "wagmi";

export const useGameKeyListener = (mapId: string) => {
    // assume mapId is padded to 32 bytes
    //const mapId = '0x0000000000000000000000000000000000000000000000000000000000000001'
    const { address } = useAccount();
    const {
        systemCalls: { moveBy },
    } = useMUD();

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
        if (e.key === "ArrowUp") {
            //console.log("up");
            moveBy(mapId, 0, -1, address as string);
        }
        if (e.key === "ArrowDown") {
            //console.log("down");
            moveBy(mapId, 0, 1, address as string);
        }
        if (e.key === "ArrowLeft") {
            //console.log("left");
            moveBy(mapId, -1, 0, address as string);
        }
        if (e.key === "ArrowRight") {
            //console.log("right");
            moveBy(mapId, 1, 0, address as string);
        }
        };

        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
    }, [moveBy, mapId]);
};

import { useEffect } from "react";
import { useMUD } from "../MUDContext";

export const useGameKeyListener = (mapId: string) => {
    // assume mapId is padded to 32 bytes
    //const mapId = '0x0000000000000000000000000000000000000000000000000000000000000001'
    const {
        systemCalls: { moveBy },
    } = useMUD();

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
        if (e.key === "ArrowUp") {
            //console.log("up");
            moveBy(mapId, 0, -1);
        }
        if (e.key === "ArrowDown") {
            //console.log("down");
            moveBy(mapId, 0, 1);
        }
        if (e.key === "ArrowLeft") {
            //console.log("left");
            moveBy(mapId, -1, 0);
        }
        if (e.key === "ArrowRight") {
            //console.log("right");
            moveBy(mapId, 1, 0);
        }
        };

        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
    }, [moveBy, mapId]);
};

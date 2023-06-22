import { useEffect } from "react";
import { useMUD } from "../MUDContext";

export const useGameKeyListener = () => {
    const {
        systemCalls: { moveBy },
    } = useMUD();

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
        if (e.key === "ArrowUp") {
            console.log("up");
        }
        if (e.key === "ArrowDown") {
            console.log("down");
        }
        if (e.key === "ArrowLeft") {
            console.log("left");
        }
        if (e.key === "ArrowRight") {
            console.log("right");
        }
        };

        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
    }, []);
};

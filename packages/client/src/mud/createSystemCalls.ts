import { Has, HasValue, getComponentValue, runQuery } from "@latticexyz/recs";
import { uuid, awaitStreamValue } from "@latticexyz/utils";
import { MonsterCatchResult } from "../monsterCatchResult";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { playerEntity, singletonEntity, worldSend, txReduced$ }: SetupNetworkResult,
  {
    GameMap,
    // Encounter,
    // MapConfig,
    // MonsterCatchAttempt,
    // Obstruction,
    // Player,
    // Position,
  }: ClientComponents
) {
  const createGame = async (width: number, height: number) => {
    const tx = await worldSend("createGame", [width, height]);
    //await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  }

  return {
    createGame
  };
}

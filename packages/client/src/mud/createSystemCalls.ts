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
      BmPlayer,
      BmPosition,
  }: ClientComponents
) {
  const createGame = async (width: number, height: number) => {
    const tx = await worldSend("createGame", [width, height]);
    //await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  }

  const moveTo = async (mapId: string, inputX: number, inputY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    // const positionId = uuid();
    // BmPosition.addOverride(positionId, {
    //   entity: ,,
    //   value: { x, y },
    // });

    // try {
    //   const tx = await worldSend("move", [mapId, x, y]);
    //   await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    // } finally {
    //   Position.removeOverride(positionId);
    // }
  };

  // const moveBy = async (mapId: string, deltaX: number, deltaY: number) => {
  //   if (!playerEntity) {
  //     throw new Error("no player");
  //   }

  //   const playerPosition = getComponentValue(
  //       BmPosition, { gamenumber: mapId, entity: playerEntity}
  //       );
  //   if (!playerPosition) {
  //     console.warn("cannot moveBy without a player position, not yet spawned?");
  //     return;
  //   }

  //   await moveTo(mapId, 
  //       parseInt(playerPosition?.x) + parseInt(deltaX), 
  //       parseInt(playerPosition?.y) + parseInt(deltaY)
  //       );
  // };

  return {
    createGame,
    moveTo,
  };
}

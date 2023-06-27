import { Has, HasValue, getComponentValue, runQuery, Entity } from "@latticexyz/recs";
import { uuid, awaitStreamValue } from "@latticexyz/utils";
import { MonsterCatchResult } from "../monsterCatchResult";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import {ethers} from "ethers";
import { padToBytes32 } from "../utils/byteutils";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

const defaultAbiCoder = ethers.utils.defaultAbiCoder;

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
  const createGame = async (width: number, height: number, address:string) => {

    const playerAddress = defaultAbiCoder.encode(
        ["address"],
        [address]);
    
    const tx = await worldSend("createGame", [width, height, playerAddress]);
    //await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  }

  const moveTo = async (mapId: string, inputX: number, inputY: number, address:string) => {
    const playerAddress = defaultAbiCoder.encode(
      ["address"],
      [address]);

    // assume mapId is padded to 32 bytes
    if (!playerEntity) {
      throw new Error("no player");
    }

    const playerKey = ethers.utils.solidityKeccak256(
        ["bytes32", "bytes32"],
        //[mapId, padToBytes32(playerEntity)]
        [mapId, padToBytes32(address)] //short term fix
    ) as Entity;

    const mapIdBytes32 = defaultAbiCoder.encode(
        ["bytes32"],
        [mapId]);

    const positionId = uuid();
    BmPosition.addOverride(positionId, {
      entity: playerKey,
      value: { inputX, inputY },
    });

    try {
      const tx = await worldSend("move", [mapIdBytes32, inputX, inputY, playerAddress]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      BmPosition.removeOverride(positionId);
    }
  };

  const moveBy = async (mapId: string, deltaX: number, deltaY: number, address: string) => {
    const playerAddress = defaultAbiCoder.encode(
      ["address"],
      [address]);

    // assume mapId is padded to 32 bytes
    if (!playerEntity) {
      throw new Error("no player");
    }
    const playerKey = ethers.utils.solidityKeccak256(
      ["bytes32", "bytes32"],
      //[mapId, padToBytes32(playerEntity)]
      [mapId, padToBytes32(address)]//short term fix
    ) as Entity;

    const playerPosition = getComponentValue(BmPosition, playerKey);

    if (!playerPosition) {
      console.warn("cannot moveBy without a player position, not yet spawned?");
      return;
    }

    await moveTo(mapId, 
        parseInt(playerPosition.x) + parseInt(deltaX), 
        parseInt(playerPosition.y) + parseInt(deltaY),
        address
        );
  };

  return {
    createGame,
    moveTo,
    moveBy,
  };
}

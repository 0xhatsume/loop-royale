// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { BattleMap } from "../codegen/Tables.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";
import { getUniqueEntity} from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

contract BattleMapSystem is System {
    //event GameCreated(uint256 battleMapId, uint32 width, uint32 height);
    function createGame(uint32 width, uint32 height) public {

        bytes32 player = addressToEntityKey(address(_msgSender()));
        bytes32 battleMapId = getUniqueEntity();
        BattleMap.set(battleMapId, player, false, width, height, false, false, bytes32(0));
        
        //emit GameCreated(uint256(battleMapId), width, height);
    }

}
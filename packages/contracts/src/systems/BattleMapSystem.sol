// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { BattleMap, BmPlayer, BmPosition, BmObstruction } from "../codegen/Tables.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { mapAndpositionToEntityKey } from "../mapAndpositionToEntityKey.sol";
import { mapAndentityToEntityKey } from "../mapAndentityToEntityKey.sol";
import { getUniqueEntity} from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

contract BattleMapSystem is System {
    //event GameCreated(uint256 battleMapId, uint32 width, uint32 height);
    function createGame(uint32 width, uint32 height) public {

        // create entity keys
        bytes32 player = addressToEntityKey(address(_msgSender()));
        bytes32 battleMapId = getUniqueEntity();
        bytes32 playerEntity = mapAndentityToEntityKey(battleMapId, player);

        // create map
        BattleMap.set(battleMapId, player, false, 
            width, height, false, false, bytes32(0));
        
        // create player
        BmPlayer.set(playerEntity, 
                battleMapId,
                player,
                100,    // health
                false // dead
                );

        //emit GameCreated(uint256(battleMapId), width, height);

        // set player position
        BmPosition.set(playerEntity, 5, 5);
    }

    function move(bytes32 mapId, uint32 x, uint32 y) public {
        // get player entity key
        bytes32 player = addressToEntityKey(address(_msgSender()));
        bytes32 playerEntity = mapAndentityToEntityKey(mapId, player);

        // get map state
        (, bool gamestart, uint32 width, uint32 height,
        bool gamepaused, bool gameend, 
        ) = BattleMap.get(mapId);
        
        // get player current position
        (uint32 fromX, uint32 fromY) = BmPosition.get(playerEntity);
        require(distance(fromX, fromY, x, y) == 1, 
            "can only move to adjacent spaces");
        
        // check for obstructions
        bytes32 positionkey = mapAndpositionToEntityKey(mapId, x, y);
        require(!BmObstruction.get(positionkey), 
            "this space is obstructed");

        // constraint movements to within map bounds
        BmPosition.set(playerEntity, x, y);

        // check for fights and powerups

    }

    function distance(uint32 fromX, uint32 fromY, uint32 toX, uint32 toY) internal pure returns (uint32) {
        uint32 deltaX = fromX > toX ? fromX - toX : toX - fromX;
        uint32 deltaY = fromY > toY ? fromY - toY : toY - fromY;
        return deltaX + deltaY;
    }




}
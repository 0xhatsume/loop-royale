// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { BattleMap, BmPlayer, 
    BmItem,
    MapMembers,
    SpawnPos, 
    //ItemPos,
    BmPosition, BmObstruction } from "../codegen/Tables.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { mapAndpositionToEntityKey } from "../mapAndpositionToEntityKey.sol";
import { mapAndentityToEntityKey } from "../mapAndentityToEntityKey.sol";
import { getUniqueEntity} from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

// Import user types
import { ItemType } from "../codegen/Types.sol";

contract BattleMapSystem is System {
    //event GameCreated(uint256 battleMapId, uint32 width, uint32 height);

    function pauseGame(bytes32 mapId, address playerAddress) public {
        // create entity keys
        bytes32 player = addressToEntityKey(playerAddress); //short term fix
        //bytes32 player = addressToEntityKey(address(_msgSender()));

        // check if player is owner
        require(BattleMap.getGamecreatedby(mapId) == player,
        "only map creator can pause game");

        // check if game has started
        require(BattleMap.getGamestart(mapId),
        "game has not started");

        // check if game has ended
        require(!BattleMap.getGameend(mapId),
        "game has ended");

        // pause game
        BattleMap.setGamepaused(mapId, true);
    }

    function endGame(bytes32 mapId, address playerAddress) public {
        // create entity keys
        bytes32 player = addressToEntityKey(playerAddress); //short term fix
        //bytes32 player = addressToEntityKey(address(_msgSender()));

        // check if player is owner
        require(BattleMap.getGamecreatedby(mapId) == player,
        "only map creator can end game");

        // check if game has started
        require(BattleMap.getGamestart(mapId),
        "game has not started");

        // check if game has ended
        require(!BattleMap.getGameend(mapId),
        "game has ended");

        // end game
        BattleMap.setGameend(mapId, true);
    }

    function move(bytes32 mapId, uint32 x, uint32 y, address playerAddress) public returns (bool){
        // get player entity key
        bytes32 player = addressToEntityKey(playerAddress); //short term fix
        //bytes32 player = addressToEntityKey(address(_msgSender()));
        bytes32 playerEntity = mapAndentityToEntityKey(mapId, player);
        bytes32 positionkey = mapAndpositionToEntityKey(mapId, x, y);

        // check if move allowed
        require(_checkMoveAllowed(mapId, x, y, playerAddress), "move not allowed");
        
        // check if reached any item
        (bool itemExists, int32 buff) = checkItemExists(mapId, x, y);
        if (itemExists) {
            // get player current buff
            int32 currentFt = BmPlayer.getFt(playerEntity);
            // update player buff
            BmPlayer.setFt(playerEntity, currentFt+ buff);
            // delete item
            BmItem.deleteRecord(positionkey);
        }

        // get map players
        bytes32[] memory playerEntities = MapMembers.get(mapId);

        // loop through playerEntities to check for battle
        for (uint i = 0; i < playerEntities.length; i++) {
            
            // check if player is not self
            if(playerEntities[i] != playerEntity){
                (uint32 playerX, uint32 playerY) = BmPosition.get(playerEntities[i]);

                // check if other alive player is at new position then battle
                if (playerX == x && playerY == y && !BmPlayer.getDead(playerEntities[i])) {

                    // if player is winner, set player position (updating BattleFts returns winner)
                    if (playerEntity == _updateBattleFts(mapId, playerEntity, playerEntities[i]))
                    {
                        // set player position if there is no battle
                        BmPosition.set(playerEntity, x, y);
                        return true;
                    }
                }
            }
        }

        // set player position if there is no battle
        BmPosition.set(playerEntity, x, y);
        return true;
    }

    function sMove(bytes32 mapId, uint32 x, uint32 y, address playerAddress) public {
        // get player entity key
        bytes32 player = addressToEntityKey(playerAddress); //short term fix
        //bytes32 player = addressToEntityKey(address(_msgSender()));
        bytes32 playerEntity = mapAndentityToEntityKey(mapId, player);
        //bytes32 positionkey = mapAndpositionToEntityKey(mapId, x, y);

        // check if move allowed
        //require(_checkMoveAllowed(mapId, x, y, playerAddress), "move not allowed");
        // set player position if there is no battle
        BmPosition.set(playerEntity, x, y);
    }
    // function move(bytes32 mapId, uint32 x, uint32 y, address playerAddress) public pure returns (bool){
    //     //return _move(mapId, x, y, address(_msgSender()));
    //     return _move(mapId, x, y, playerAddress); //short term fix
    // }

    function _updateBattleFts(bytes32 mapId, bytes32 playerEntity, bytes32 otherPlayerEntity) internal returns (bytes32){
        // get winner
        bytes32 winner = checkBattleResults(mapId, playerEntity, otherPlayerEntity);
        // get loser
        bytes32 loser = playerEntity == winner ? playerEntity : otherPlayerEntity;

        // set winner new ft
        BmPlayer.setFt(winner, BmPlayer.getFt(winner) + BmPlayer.getFt(loser));
        // set loser new ft
        BmPlayer.setFt(loser, 0);
        // set loser dead status to true
        BmPlayer.setDead(loser, true);

        return winner;
    }

    function _checkMoveAllowed(bytes32 mapId, uint32 x, uint32 y, address playerAddress) internal view returns (bool){
        // get player entity key
        bytes32 player = addressToEntityKey(playerAddress); //short term fix
        //bytes32 player = addressToEntityKey(address(_msgSender()));
        bytes32 playerEntity = mapAndentityToEntityKey(mapId, player);

        // get map state
        (, bool gamestart, uint32 width, uint32 height,
        bool gamepaused, bool gameend, ,,,
        ) = BattleMap.get(mapId);
        
        // check if game has started
        require(gamestart, "game has not started");

        // check if game is paused
        require(!gamepaused, "game is paused");

        // check if game has ended
        require(!gameend, "game has ended");

        // get player current position
        require(_checkDistanceAllowed(playerEntity,x,y), "can only move to adjacent spaces");
        
        // check for obstructions
        bytes32 positionkey = mapAndpositionToEntityKey(mapId, x, y);
        require(!BmObstruction.get(positionkey), 
            "this space is obstructed");

        // constraint movements to within map bounds
        require(x < width && y < height && x >= 0 && y >= 0, 
            "cannot move outside map bounds");

        return true;
    }

    function checkBattleResults(bytes32 mapId, bytes32 player1, bytes32 player2) public view returns (bytes32){
        bytes32 player1Entity = mapAndentityToEntityKey(mapId, player1);
        bytes32 player2Entity = mapAndentityToEntityKey(mapId, player2);

        // get player1 ft
        uint256 player1Ft = uint256(int256(BmPlayer.getFt(player1Entity)));
        // get player2 ft
        uint256 player2Ft = uint256(int256(BmPlayer.getFt(player2Entity)));

        uint256 totalFt = player1Ft + player2Ft;

        // create random number from 1 to 100
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(
            mapId, player1Entity, player2Entity, totalFt,
            block.timestamp, block.difficulty))) % 1e18 + 1;

        uint256 player1Chance = _divide(player1Ft, totalFt) * 100;

        // 
        if (randomNumber <= player1Chance) {
            return player1;
        } else {
            return player2;
        }

    }

    function checkItemExists(bytes32 mapId, uint32 x, uint32 y) public view returns (bool, int32) {
        bytes32 positionkey = mapAndpositionToEntityKey(mapId, x, y);
        ( , int32 buff, bytes32 itemMapId, , ) = BmItem.get(positionkey);
        if (mapId == itemMapId) {
            return (true, buff);
        } else {
            return (false, 0);
        }
    }

    function _checkDistanceAllowed(bytes32 playerEntity, uint32 toX, uint32 toY) internal view returns (bool) {
        (uint32 fromX, uint32 fromY) = BmPosition.get(playerEntity);
        return _distance(fromX, fromY, toX, toY) == 1;
    }

    function _distance(uint32 fromX, uint32 fromY, uint32 toX, uint32 toY) internal pure returns (uint32) {
        uint32 deltaX = fromX > toX ? fromX - toX : toX - fromX;
        uint32 deltaY = fromY > toY ? fromY - toY : toY - fromY;
        return deltaX + deltaY;
    }

    function _divide(uint256 a, uint256 b) internal pure returns(uint256) {
        require(b != 0, "division by zero will result in infinity.");
        return (a * 1e18) / b;
    }

    function deleteGame(bytes32 mapId, address playerAddress) public {
        // create entity keys
        bytes32 player = addressToEntityKey(playerAddress); //short term fix
        //bytes32 player = addressToEntityKey(address(_msgSender()));

        // check if player is owner
        require(BattleMap.getGamecreatedby(mapId) == player,
        "only map creator can delete game");

        require(!BattleMap.getGamestart(mapId),
        "cannot delete game that has started");

        // delete map
        BattleMap.deleteRecord(mapId);
    }



}
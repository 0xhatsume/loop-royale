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

contract BattleInitSystem is System {

    function createGame(uint32 width, uint32 height, address playerAddress, uint256 stake, uint32 playerlimit, string memory roomname) public {

        // create entity keys
        bytes32 player = addressToEntityKey(address(playerAddress)); //short term fix
        //bytes32 player = addressToEntityKey(address(_msgSender()));
        bytes32 battleMapId = getUniqueEntity();
        bytes32 playerEntity = mapAndentityToEntityKey(battleMapId, player);

        // create map
        BattleMap.set(battleMapId, player, false, 
            width, height, false, false, bytes32(0),
            stake, playerlimit, roomname
            );
        
        // create player
        BmPlayer.set(playerEntity, 
                battleMapId,
                player,
                100,    // health
                stake,     // stake
                false // dead
                );

        //emit GameCreated(uint256(battleMapId), width, height);

        // set map players
        bytes32[] memory players = new bytes32[](1);
        players[0] = player;
        MapMembers.set(battleMapId, players);

        // set player position
        BmPosition.set(playerEntity, 5, 5);
    }

    function registerPlayer(bytes32 mapId, uint256 stake, address playerAddress) public {
        // create entity keys
        bytes32 player = addressToEntityKey(playerAddress); //short term fix
        //bytes32 player = addressToEntityKey(address(_msgSender()));
        bytes32 playerEntity = mapAndentityToEntityKey(mapId, player);

        // create player
        BmPlayer.set(playerEntity, 
                mapId,
                player,
                100,    // health
                stake,     // stake
                false // dead
                );

        // set map players
        MapMembers.push(mapId, playerEntity);
    }

    function setStake(bytes32 mapId, uint256 stake, address playerAddress) public {
        // create entity keys
        bytes32 player = addressToEntityKey(playerAddress); //short term fix
        //bytes32 player = addressToEntityKey(address(_msgSender()));
        bytes32 playerEntity = mapAndentityToEntityKey(mapId, player);

        // require player to be in map
        require(BmPlayer.getPlayer(playerEntity)==player,
        "only players in map can set own stake");

        // cannot set stake when game has started
        require(!BattleMap.getGamestart(mapId),
        "cannot set stake when game has started");

        // set stake
        BmPlayer.setStake(playerEntity, stake);

    }

    function spawnPlayers(bytes32 mapId) public {
        // create entity keys
        // bytes32 player = addressToEntityKey(address(_msgSender()));
        // bytes32 playerEntity = mapAndentityToEntityKey(mapId, player);

        // get map dimensions
        uint32 width = BattleMap.getWidth(mapId);
        uint32 height = BattleMap.getHeight(mapId);

        // get map players
        bytes32[] memory players = MapMembers.get(mapId);

        // for each player, set their position
        for (uint i=0; i<players.length; i++) {
            // get player entity
            bytes32 playerEntity = players[i];

            // get a random value for x and y within map dimensions
            uint32 x = uint32(uint256(
                keccak256(abi.encodePacked(
                    width, playerEntity,
                    blockhash(block.number - 1), block.difficulty, i))
                ) % width);
            uint32 y = uint32(uint256(
                keccak256(abi.encodePacked(
                    height, playerEntity,
                    blockhash(block.number - 1), block.difficulty, i))
                ) % height);

            
            // set player position
            BmPosition.set(playerEntity, x, y);
        }

        //TODO: HOW TO PREVENT SPAWNING ON SAME POSITION?
    }

    function spawnItems(bytes32 mapId) public {
        require(BattleMap.getGamestart(mapId),
        "game not started");

        // get number of players on map
        uint32 numPlayers = uint32(MapMembers.get(mapId).length);
        uint32 numItemsToMaintain = numPlayers - 1;
        numItemsToMaintain = numItemsToMaintain < 1 ? 1 : numItemsToMaintain;

        // get number of items to spawn
        uint32 numItemsToSpawn = numItemsToMaintain - uint32(
                                        SpawnPos.getX(mapId).length);
        numItemsToSpawn = numItemsToSpawn < 0 ? 0 : numItemsToSpawn;

        require(numItemsToSpawn > 0,"nothing to spawn");

        // get map dimensions
        uint32 width = BattleMap.getWidth(mapId);
        uint32 height = BattleMap.getHeight(mapId);

        for (uint i=0; i<numItemsToSpawn; i++) {
            
            uint256 rand = uint256(
                keccak256(abi.encodePacked(
                    numPlayers, mapId,
                    blockhash(block.number - 1), block.difficulty, i))
                );
            
            // get a random value for x and y within map dimensions
            uint32 x = uint32(uint256(
                keccak256(abi.encodePacked(
                    width, mapId,
                    blockhash(block.number - 1), block.difficulty, i))
                ) % width);
            uint32 y = uint32(uint256(
                keccak256(abi.encodePacked(
                    height, mapId,
                    blockhash(block.number - 1), block.difficulty, i))
                ) % height);
            
            // create item
            bytes32 itemId = mapAndpositionToEntityKey(mapId, x, y);
            BmItem.set(itemId, 
                        ItemType.PowerUp, 
                        rand%2==0 ? int32(-50) : int32(50),
                        mapId,
                        x,
                        y
            );

            // append item position to store
            // ItemPos.pushX(mapId, x);
            // ItemPos.pushY(mapId, y);

        }
    }

    function startGame(bytes32 mapId, address playerAddress) public {
        // create entity keys
        bytes32 player = addressToEntityKey(playerAddress); //short term fix
        //bytes32 player = addressToEntityKey(address(_msgSender()));

        // check if player is owner
        require(BattleMap.getGamecreatedby(mapId) == player,
        "only map creator can start game");

        // check if game has started
        require(!BattleMap.getGamestart(mapId),
        "game already started");

        // check if game has ended
        require(!BattleMap.getGameend(mapId),
        "cannot start game that has ended");

        // start game
        BattleMap.setGamestart(mapId, true);
        // spawn Players
        spawnPlayers(mapId);
        // spaw Items
        spawnItems(mapId);

    }

}
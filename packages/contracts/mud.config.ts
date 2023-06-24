import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export default mudConfig({
  enums: {
    MonsterCatchResult: ["Missed", "Caught", "Fled"],
    MonsterType: ["None", "Eagle", "Rat", "Caterpillar"],
    TerrainType: ["None", "TallGrass", "Boulder"],
    ItemType: ["None", "PowerUp", "Barrier"],
  },
  tables: {
    Encounter: {
      keySchema: {
        player: "bytes32",
      },
      schema: {
        exists: "bool",
        monster: "bytes32",
        catchAttempts: "uint256",
      },
    },
    EncounterTrigger: "bool",
    Encounterable: "bool",

    MapConfig: {
      keySchema: {},
      dataStruct: false,
      schema: {
        width: "uint32",
        height: "uint32",
        terrain: "bytes",
      },
    },

    MonsterCatchAttempt: {
      ephemeral: true,
      dataStruct: false,
      keySchema: {
        encounter: "bytes32",
      },
      schema: {
        result: "MonsterCatchResult",
      },
    },
    Monster: "MonsterType",
    Movable: "bool",
    Obstruction: "bool",
    OwnedBy: "bytes32",
    Player: "bool",
    Position: {
      dataStruct: false,
      schema: {
        x: "uint32",
        y: "uint32",
      },
    },


    // Battle Royale Tables
    BattleMap: {

      dataStruct: false,
      schema: {
        gamecreatedby: "bytes32",
        gamestart: "bool",
        width: "uint32",
        height: "uint32",
        gamepaused: "bool",
        gameend: "bool",
        winner:"bytes32"
      }
    },

    // key is mapId
    MapMembers: {
      dataStruct: false,
      schema: {
        members: "bytes32[]"
      }
    },

    BmItem: {
      // key is mapId & x & y to bytes
      dataStruct: false,
      schema: {
        itemtype: "ItemType",
        buff: "int32",
        mapId: "bytes32", //for easy search
      },
    },

    BmPlayer: {
      // player key is mapId & player address to bytes
      dataStruct: false,
      schema: {
        mapId: "bytes32", //for easy search
        player: "bytes32", //for easy search
        ft: "uint32",
        stake: "uint32",
        dead: "bool"
      },
    },

    BmPosition: {
      // entity will tell where the key is from
      dataStruct: false,
      schema: {
        x: "uint32",
        y: "uint32",
      }
    },

    SpawnPos: {
      dataStruct: false,
      schema: {
        x: "uint32[]",
        y: "uint32[]",
      }
    },

    ItemPos: {
      dataStruct: false,
      schema: {
        x: "uint32[]",
        y: "uint32[]",
      }
    },

    BmObstruction: "bool", // key is mapId & x & y to bytes

  },

  modules: [{
    name: "UniqueEntityModule",
    root: true,
    args: [],
  },
  {
    name: "KeysInTableModule",
    root: true,
    args: [resolveTableId("BattleMap")],
  },
  {
    name: "KeysWithValueModule",
    root: true,
    args: [resolveTableId("BattleMap")],
  }
  ],
});

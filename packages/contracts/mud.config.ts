import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export default mudConfig({
  enums: {
    MonsterCatchResult: ["Missed", "Caught", "Fled"],
    MonsterType: ["None", "Eagle", "Rat", "Caterpillar"],
    TerrainType: ["None", "TallGrass", "Boulder"],
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

    BattleMap: {
      keySchema: {
        gamenumber: "bytes32",
      },
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

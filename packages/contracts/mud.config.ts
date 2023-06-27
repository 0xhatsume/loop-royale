import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export default mudConfig({
  enums: {
    ItemType: ["None", "PowerUp", "Barrier"],
  },
  tables: {
    
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

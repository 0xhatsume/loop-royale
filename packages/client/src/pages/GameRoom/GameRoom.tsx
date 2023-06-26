import React, {useState} from 'react';
import { useGameKeyListener } from '../../hooks/useGameKeyListener';
import { useMUD } from '../../MUDContext';
import { useParams } from 'react-router-dom';
import { getComponentValue, runQuery, Has, HasValue, Entity } from '@latticexyz/recs';
import GameChatBox from '../../components/GameChatBox/GameChatBox';
import RankMonitor from '../../components/RankMonitor/RankMonitor';
//import { useRows, useRow } from "@latticexyz/react";
import { padToBytes32 } from '../../utils/byteutils';
import { ethers } from 'ethers';
import { useKeyboardMovement } from '../../useKeyboardMovement';
import { useComponentValue } from "@latticexyz/react";
import { avatars } from '../../constants/assets';

const GameRoom = () => {
  console.log("GameRoom Refresh")
  const { components: { BattleMap, BmPlayer, BmPosition },
            network: { storeCache, playerEntity },
          } = useMUD();
  const params = useParams();
  const mapId = params?.id as string;
  const mapParams = getComponentValue(BattleMap, mapId);
  const mapHeight = mapParams?.height;
  const mapWidth = mapParams?.width;

  try {
    if (isNaN(mapHeight * mapWidth)){
      return (
        <div className="h-full w-full
        flex justify-end items-start">
          Invalid Game
        </div>
      )
    }
  } catch (error) {
    return (
      <div className="h-full w-full
      flex justify-end items-start">
        Invalid Game
      </div>
    )
  }
  
  const testPlayerEntity = "0x77510976e7f643cf6985fe78fe661fdf7f5ceb44"
  const mapIdBytes32String = padToBytes32(mapId);

  const playerEntityKeyBytes32String = ethers.utils.solidityKeccak256(
    ["bytes32", "bytes32"],
    [mapIdBytes32String, padToBytes32(testPlayerEntity)]
  ) as Entity
  
  useGameKeyListener(mapIdBytes32String);
  // get player position
  const playerPosition = useComponentValue(BmPosition, 
    playerEntityKeyBytes32String
  )

  const rows = new Array(mapHeight).fill(0).map((_, i) => i);
  const columns = new Array(mapWidth).fill(0).map((_, i) => i); 
  
  const [avatarUrl, setAvatarUrl] = useState<string>(avatars?.[0].src);
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    avatars.map((avatar, i) => {
      if (avatar?.name === e.currentTarget.value) {
        setAvatarUrl(avatar.src)
      }
    })
  }
  
  return (
    <div className="h-full w-full
    flex justify-end items-start
    ">  
        
        {/* left placeholder */}
        <div className="h-full"></div>

        {/* Game Area */}
        <div className="h-full w-1/2 max-w-1/2 flex flex-col
        justify-start items-center
        
        ">

          {/* Game Board */}
          <div className={`w-full min-h-[44rem] min-w-[44rem] 
          max-h-[44rem] p-4
          overflow-auto
          flex flex-col 
          ${mapHeight>11?"justify-start":"justify-center"} 
          ${mapWidth>14?"items-start":"items-center"}
            `}>
            {rows.map((_, y) => {
              return (
              <div key={`row-${y}`} className="flex justify-start items-center">
                {columns.map((_, x) => {
                return (
                  <div key={`${x}-${y}`} 
                    className="bg-blue-900/30 border border-red-500
                    min-h-[4rem] min-w-[4rem] 
                    flex justify-center items-center
                    "
                    
                    style={{
                      backgroundImage: `url(${
                        (x==playerPosition?.x && y==playerPosition?.y)? 
                        avatarUrl : ""
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                    >
                      {(x==playerPosition?.x && y==playerPosition?.y)? 
                      
                      null
                      
                      :`${x}-${y}`}
                    </div>
                )
              })}
              </div>
              )
            })}
          </div>

          {/* Controls Panel */}
          <div className="w-full grow 
          flex p-3 items-center
          ">

            <button className="
            bg-red-400 hover:bg-red-600
            h-3/4 w-[6rem]
            px-4
            rounded-2xl border border-red-600
            hover:border-orange-800 hover:border-2
            hover:shadow-lg hover:shadow-red-500
            ">
              Owner Start Game
              </button>

            <div className="h-3/4 w-1/5
            mx-2 flex items-center overflow-hidden
            border rounded-2xl border-amber-700
            ">
                <input type="number" defaultValue={0.1} 
                  name="stake" 
                  className="px-2
                  h-full w-1/2
                  bg-transparent
                  text-white font-semibold
                  text-center
                  rounded-l-2xl
                  "
                  />
                  <button className="
                  h-full w-1/2
                  bg-orange-700 hover:bg-orange-500
                  hover:font-bold
                  hover:border-2 hover:border-orange-600
                  "
                  >
                    Confirm Stake
                    </button>

            </div>
            <div className="
            flex w-fit h-3/4 overflow-hidden
            bg-yellow-600 hover:bg-yellow-400
            px-2 py-2
            rounded-2xl
            ">
              <img 
                  className="h-[4.5rem] w-[4.5rem]
                  rounded-l-lg
                  "
                  src={avatarUrl}/>
              <select className="h-full text-black
              bg-transparent focus:outline-none
              "
              onChange={(e) => {handleAvatarSelect(e)}}
              >
                <option key={0} selected>Choose Avatar</option>
                  {/* <option value="Warrior1">
                    warriror1
                  </option> */}
                {avatars.map((avatar, i) => {
                  return (
                    <option key={i+1} value={avatar?.name}>
                      {avatar?.name?? "??"}
                    </option>
                  )
                  })
                }
              </select>
            </div>

          </div>

        </div>
        
        {/* Side Bar Rank and Chat */}
        <div className="h-full w-1/3
        px-4
        flex flex-col
        ">

          {/* Rank */}
          <RankMonitor/>

          {/* Chat */}
          <GameChatBox/>
          
        </div>
      </div>
  )
  
}

export default GameRoom
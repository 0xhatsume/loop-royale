import React from 'react';
import { useGameKeyListener } from '../../hooks/useGameKeyListener';
import { useMUD } from '../../MUDContext';
import { useParams } from 'react-router-dom';
import { getComponentValue, runQuery, Has, HasValue, Entity } from '@latticexyz/recs';
import GameChatBox from '../../components/GameChatBox/GameChatBox';
import RankMonitor from '../../components/RankMonitor/RankMonitor';
//import { useRows, useRow } from "@latticexyz/react";
import { padToBytes32 } from '../../utils/byteutils';
import { ethers } from 'ethers';

const GameRoom = () => {
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
  // get player position
  const playerPosition = getComponentValue(BmPosition, 
    ethers.utils.solidityKeccak256(
      ["bytes32", "bytes32"],
      [padToBytes32(mapId), padToBytes32(testPlayerEntity)]
    ) as Entity
  )
  
  useGameKeyListener();
  
  const rows = new Array(mapHeight).fill(0).map((_, i) => i);
  const columns = new Array(mapWidth).fill(0).map((_, i) => i);  
  
  return (
    <div className="h-full w-full
    flex justify-end items-start
    ">  
        
        {/* left placeholder */}
        <div className="h-full border"></div>

        {/* Game Area */}
        <div className="h-full w-1/2 max-w-1/2 flex flex-col
        justify-start items-center
        border">

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
                    ">
                      {(x==playerPosition?.x && y==playerPosition?.y)? "🧑":`${x}-${y}`}
                    </div>
                )
              })}
              </div>
              )
            })}
          </div>

          {/* Controls Panel */}
          <div className="w-full grow 
          border border-green-500 border-2
          ">

          </div>

        </div>
        
        {/* Side Bar Rank and Chat */}
        <div className="h-full w-1/3 border-l
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
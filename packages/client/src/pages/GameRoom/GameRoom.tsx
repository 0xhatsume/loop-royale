import React from 'react';
import { useGameKeyListener } from '../../hooks/useGameKeyListener';
import { useMUD } from '../../MUDContext';
import { useParams } from 'react-router-dom';
import { getComponentValue } from '@latticexyz/recs';
import GameChatBox from '../../components/GameChatBox/GameChatBox';
import RankMonitor from '../../components/RankMonitor/RankMonitor';

const GameRoom = () => {
  useGameKeyListener();

  const params = useParams();
  // console.log("room params", params??"")
  const { components: { BattleMap } } = useMUD();

  const mapParams = getComponentValue(BattleMap, "0x01");
  const mapHeight = mapParams?.height;
  const mapWidth = mapParams?.width;
  //console.log(mapHeight, mapWidth)
  const height = 12
  const width = 15
  const rows = new Array(height).fill(0).map((_, i) => i);
  const columns = new Array(width).fill(0).map((_, i) => i);
  
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
          ${height>11?"justify-start":"justify-center"} 
          ${width>14?"items-start":"items-center"}
            `}>
            {rows.map((_, y) => {
              return (
              <div className="flex justify-start items-center">
                {columns.map((_, x) => {
                return (
                  <div key={`${x}-${y}`} 
                    className="bg-blue-900/30 border border-red-500
                    min-h-[4rem] min-w-[4rem] 
                    flex justify-center items-center
                    ">
                      {`${x}-${y}`}
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
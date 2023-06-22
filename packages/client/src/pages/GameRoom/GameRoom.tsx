import React from 'react';
import { useGameKeyListener } from '../../hooks/useGameKeyListener';
import { useMUD } from '../../MUDContext';
import { useParams } from 'react-router-dom';
import { getComponentValue } from '@latticexyz/recs';

const GameRoom = () => {
  useGameKeyListener();

  const params = useParams();
  // console.log("room params", params??"")
  const { components: { BattleMap } } = useMUD();

  const mapParams = getComponentValue(BattleMap, "0x01");
  const mapHeight = mapParams?.height;
  const mapWidth = mapParams?.width;
  //console.log(mapHeight, mapWidth)
  
  return (
    <div className="h-full w-full
    flex justify-end items-start
    ">  

        <div className="h-full border"></div>

        {/* Game Board */}
        <div className="h-4/5 w-2/5 
        mt-8 mx-20
        border"></div>
        
        {/* Side Bar Rank and Chat */}
        <div className="h-full w-1/3 border-l

        ">


          
        </div>
      </div>
  )
}

export default GameRoom
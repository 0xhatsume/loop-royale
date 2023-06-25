import React from 'react';
import { Link } from 'react-router-dom';
import { useMUD } from '../../MUDContext';
import { useComponentValue } from "@latticexyz/react";

const RoomCard = ({entity, roomNum, roomName, format, host, players, status}) => {
  const { 
    components: { BattleMap },
  } = useMUD();

  const {gamestart} = useComponentValue(BattleMap, entity);
  console.log(gamestart)

  return (
    
    <div to={`/game/${entity}`} className="w-full py-3
    bg-amber-100 
    text-gray-700 font-medium
    hover:text-orange-600 hover:font-bold
    flex items-center 
    
    flex-nowrap text-center
    border border-gray-400
    ">
      <div className="w-[5rem] px-2">{roomNum??"x"}</div>
      <div className="w-[15rem] 
      text-left pl-4">
          {roomName??"the unknown"}</div>
      <div className="w-[7rem]">{format??"? x ?"}</div>
      <div className="w-[11.5rem]">{host??"anon"}</div>
      <div className="w-[7rem]">{players??"?/?"}</div>

      <div className="flex justify-center flex-grow">

        <Link to={`/game/${entity}`} className="rounded-lg
          bg-orange-700 hover:bg-orange-400
          border 
          hover: border-2 hover:border-orange-700
          w-[8rem] py-1 text-white
        ">
          {gamestart ? "Game in Progress" : "Join Game"}
          </Link>
      </div>
    
    </div>
  )
}

export default RoomCard
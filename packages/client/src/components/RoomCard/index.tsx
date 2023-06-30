import React from 'react';
import { Link } from 'react-router-dom';
import { useMUD } from '../../MUDContext';
//import { useComponentValue } from "@latticexyz/react";

const RoomCard = ({entity, roomNum, roomName, stake, format, host, players, status}) => {
  const { 
    components: { BattleMap },
  } = useMUD();

  //const {gamestart} = useComponentValue(BattleMap, entity);

  return (
    
    <div className={`w-full py-3
    
    ${
    status ?
      "bg-gray-400"
    : "bg-amber-100 hover:text-orange-600 "
    } 
    text-gray-700 font-medium
    hover:font-bold
    flex items-center 
    
    flex-nowrap text-center
    border border-gray-400
    `}>
      <div className="w-[5rem] px-2">{roomNum??"x"}</div>
      <div className="w-[12rem] 
      text-left pl-4">
          {roomName??"the unknown"}</div>
      <div className="w-[7rem]">{stake??"???"}</div>
      <div className="w-[7rem]">{format??"? x ?"}</div>
      <div className="w-[11.5rem]">{host??"anon"}</div>
      <div className="w-[7rem]">{players??"?/?"}</div>

      <div className="flex justify-center flex-grow">

        <Link to={`/game/${entity}`} className={`rounded-lg
          ${status ?
          "bg-gray-700 hover:bg-gray-400"
            :
          "bg-orange-700 hover:bg-orange-400"
          }
          border 
          hover: border-2 hover:border-orange-700
          w-[7.5rem] py-1 text-white
        `}>
          {status ? "Game Started" : "Join Game"}
          </Link>
      </div>
    
    </div>
  )
}

export default RoomCard
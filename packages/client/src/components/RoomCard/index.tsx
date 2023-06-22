import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({entity, roomNum, roomName, format, host, players, status}) => {
  
  return (
    
    <Link to={`/game/${entity}`} className="w-full py-3
    bg-amber-100 hover:bg-amber-700
    text-gray-700 hover:text-white font-medium
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

        <button className="rounded-lg
          bg-orange-400 hover:bg-orange-700
          w-[8rem] py-1 text-white
        ">
          {status ?? "???"}
          </button>
      </div>
    
    </Link>
  )
}

export default RoomCard
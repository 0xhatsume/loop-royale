import React from 'react'

const RoomCard = ({roomNum, roomName, format, host, players, status}) => {
  return (
    <div className="w-full py-3
    bg-amber-100 text-gray-700 font-medium
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
    
    </div>
  )
}

export default RoomCard
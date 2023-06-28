import React from 'react';
import {fromBn} from 'evm-bn';

const RankCard = ({avatar, player, ft, stake, status}) => {
  return (
    <div className="w-full h-[5rem]
            px-3 py-1
            flex items-center align-text-middle
            bg-[#d4bcad] hover:bg-orange-300
            text-gray-700 font-semibold
            hover:text-white
            border-y
            ">

            <div className="w-[5rem] h-full px-2.5 
            flex items-center
            
            ">
                {avatar??""}
            </div>
            <div className="w-[8rem] h-full pl-2 px-1 
            flex items-center 
            ">
                {player??"???"}
            </div>
            <div className="w-[7rem] h-full px-1 
            flex items-center 
            ">
                {ft??"???"}
            </div>
            <div className="w-[7rem] h-full px-1 
            flex items-center 
            ">
                {fromBn(stake)??"???"}
            </div>
            <div className="w-[5rem] h-full px-1 
            flex items-center 
            ">
                {status??"???"}
            </div>

    </div>
    )
}

export default RankCard
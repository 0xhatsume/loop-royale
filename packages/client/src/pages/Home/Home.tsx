import React from 'react';
import { useEntityQuery } from '@latticexyz/react';
import { Entity, Has, getComponentValueStrict, getComponentValue } from "@latticexyz/recs";
import { useMUD } from '../../MUDContext';
import RoomCard from '../../components/RoomCard';
import {ethers} from 'ethers';
import { addressShortener } from '../../utils/addressShortener';


const Home = () => {
  const {
    components: { BattleMap },
    systemCalls: { createGame },
  } = useMUD();

  const gameCreator = (gamecreatedby: string) => {
    return addressShortener(ethers.utils.hexStripZeros(gamecreatedby, 32))
  }
  
  const battleMaps = useEntityQuery([Has(BattleMap)]).map((entity) => {
    return {...getComponentValue(BattleMap, entity), 
              entity,
              roomNumber: parseInt(entity)
            }
  });

  return (
    <div className="w-full h-full
    flex justify-center items-start
    ">
    
    
      <div className="flex flex-col items-center
        w-1/2 h-2/3 mt-5
      ">
      
        {/* Title bar */}
        <div className="w-full flex flex-row justify-between items-center">
          <div className="mx-2 text-lg font-bold">Game Lobby</div>
          <button className="m-2 mb-4 
            bg-orange-500 hover:bg-orange-700
            border rounded-lg p-2"
            onClick={() => createGame(9,9)}
            >Create Game</button>
        </div>

          {/* room screen */}
          <div className="w-full h-full flex flex-col items-center
          
          ">

            <div className="w-full flex items-center
              py-1 bg-[#282828]
              flex-nowrap text-center
              border rounded-t-lg 
            ">
              <div className="w-[5rem] px-2">Game</div>
              <div className="w-[15rem] text-left pl-4">Game Name</div>
              <div className="w-[7rem]">Format</div>
              <div className="w-[11.5rem]">Host</div>
              <div className="w-[7rem]">Players</div>
              <div className="w-[13rem]">Status</div>
            </div>

            {/* room cards */}
            <div className="w-full h-4/5
              bg-[#eebd9f] overflow-y-auto
              shadow-inner shadow-lg
              border
            ">

            {
              battleMaps.map((bm) => {
                return(
                <RoomCard 
                  key={bm.entity}
                  entity={bm.entity}
                  roomNum={bm.roomNumber}
                  roomName={null}
                  format={`${bm.width} x ${bm.height}`}
                  host={gameCreator(bm.gamecreatedby)}
                  players={null}
                  status={null}
                />)
              })
            }
            </div>


            <div className="w-full h-3/5 bg-gray-700/30
            border rounded-b-lg 
            ">

            </div>
          </div>
      
      
      </div>
    </div>
  )
}

export default Home
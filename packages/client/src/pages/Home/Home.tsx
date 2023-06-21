import React from 'react';
import { useEntityQuery } from '@latticexyz/react';
import { Entity, Has, getComponentValueStrict, getComponentValue } from "@latticexyz/recs";
import { useMUD } from '../../MUDContext';


const Home = () => {
  const {
    components: { BattleMap },
    systemCalls: { createGame },
  } = useMUD();

  const battleMaps = useEntityQuery([Has(BattleMap)]).map((entity) => {
    return (getComponentValue(BattleMap, entity))
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

            <div className="w-full flex justify-between items-center
              px-7 bg-[#282828]
              border rounded-t-lg 
            ">
              <span>No.</span>
              <span>Room Name</span>
              <span>Host</span>
              <span>Players</span>
              <span className="mr-4">Status</span>
            </div>

            <div className="w-full h-4/5
              bg-[#eebd9f] overflow-y-auto
              shadow-inner shadow-lg
              border
            ">
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
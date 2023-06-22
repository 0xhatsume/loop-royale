import React from 'react';
import RankCard from '../RankCard/RankCard';

const RankMonitor = () => {
  return (
    <div className="w-full h-[22.5rem]
        mt-2 px-2.5 pb-3.5
        flex flex-col
        border rounded-lg
        ">

        {/* Title */}
        <div className="w-full 
        flex items-center
        px-3 py-2
        text-sm text-left
        border-b
        ">
            <div className="w-[5rem] px-1 ">Avatar</div>
            <div className="w-[8rem] pl-2 px-1 ">Player</div>
            <div className="w-[7rem] px-1 ">FT</div>
            <div className="w-[7rem] px-1 ">Stake</div>
            <div className="w-[5rem] px-1 ">Status</div>
        </div>

        {/* card box */}
        <div className="w-full flex-grow overflow-y-auto
        ">
            <RankCard 
            avatar="🐱"
            player="Player 1"
            ft="FT1"
            stake="100"
            status="Alive"
            />

<RankCard 
            avatar="🐱"
            player="Player 2"
            ft="FT1"
            stake="100"
            status="Alive"
            />

<RankCard 
            avatar="🐱"
            player="Player 3"
            ft="FT1"
            stake="100"
            status="Alive"
            />

<RankCard 
            avatar="🐱"
            player="Player 4"
            ft="FT1"
            stake="100"
            status="Alive"
            />

        </div>

        </div>
    )
}

export default RankMonitor
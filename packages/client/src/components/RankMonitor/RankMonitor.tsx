import React from 'react';
import RankCard from '../RankCard/RankCard';

const RankMonitor = ({playerRanks}) => {

    return (
        <div className="w-full h-[47.5rem]
            mt-2 px-2.5 pb-3.5
            flex flex-col
            border rounded-lg
            overflow-y-auto
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
                {
                    playerRanks.map((playerRank, index) => {
                        return (
                            <RankCard
                                key={index}
                                avatar={
                                    <img 
                                    className="h-[3.6rem] w-[3.6rem]
                                    border rounded-md border-slate-600
                                    "
                                    src={playerRank.avatar}/>
                                }
                                //avatar={playerRank.avatar}
                                player={playerRank.player}
                                ft={playerRank.ft}
                                stake={playerRank.stake}
                                status={playerRank.status}
                            />
                        )
                    })
                }
            </div>

            </div>
        )
}

export default RankMonitor
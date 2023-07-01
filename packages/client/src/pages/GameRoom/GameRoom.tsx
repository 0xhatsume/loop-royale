import React, {useState, useRef} from 'react';
import { useGameKeyListener } from '../../hooks/useGameKeyListener';
import { useMUD } from '../../MUDContext';
import { useParams } from 'react-router-dom';
import { getComponentValueStrict, getComponentValue, runQuery, Has, HasValue, Entity } from '@latticexyz/recs';
import GameChatBox from '../../components/GameChatBox/GameChatBox';
import ChatBox from '../../components/ChatBox/ChatBox';
import RankMonitor from '../../components/RankMonitor/RankMonitor';
//import { useRows, useRow } from "@latticexyz/react";
import { padToBytes32 } from '../../utils/byteutils';
import { ethers } from 'ethers';
import { useKeyboardMovement } from '../../useKeyboardMovement';
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { avatars } from '../../constants/assets';
import { addressShortener } from '../../utils/addressShortener';
import { useAccount } from 'wagmi';
import {toBn, fromBn} from "evm-bn";

const GameRoom = () => {
  console.log("GameRoom Refresh")
  const { components: { BattleMap, BmPlayer, BmItem },
          systemCalls: { registerPlayer, startGame },
            network: { storeCache, playerEntity },
          } = useMUD();
  const params = useParams();
  const mapId = params?.id as string;
  const mapParams = getComponentValue(BattleMap, mapId);
  const mapHeight = mapParams?.height;
  const mapWidth = mapParams?.width;

  try {
    if (isNaN(mapHeight * mapWidth)){
      return (
        <div className="h-full w-full
        flex justify-center items-start">
          Invalid Game
        </div>
      )
    }
  } catch (error) {
    return (
      <div className="h-full w-full
      flex justify-center items-start">
        Invalid Game
      </div>
    )
  }
  
  const { address, isConnected } = useAccount();
  //const testPlayerEntity = "0x77510976e7f643cf6985fe78fe661fdf7f5ceb44"
  const mapIdBytes32String = padToBytes32(mapId);

  const playerEntityKeyBytes32String = isConnected ? ethers.utils.solidityKeccak256(
    ["bytes32", "bytes32"],
    [mapIdBytes32String, padToBytes32(address??"0x00")]
  ) as Entity : null;
  
  useGameKeyListener(mapIdBytes32String);
  // get player position
  // const playerPosition = useComponentValue(BmPosition, 
  //   playerEntityKeyBytes32String as Entity
  // ) ;
  
  const rows = new Array(mapHeight).fill(0).map((_, i) => i);
  const columns = new Array(mapWidth).fill(0).map((_, i) => i); 
  
  const [avatarUrl, setAvatarUrl] = useState<string>(avatars?.[0].src);
  const [opponentsAvatarUrl, setOpponentsAvatarUrl] = useState<string>(avatars?.[1].src);
  const [itemUrl, setItemUrl] = useState<string>("/assets/items/powerup.gif");

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    avatars.map((avatar, i) => {
      if (avatar?.name === e.currentTarget.value) {
        setAvatarUrl(avatar.src)
        // total only 4 so if i is chosen, give it the next value or wrap around
        setOpponentsAvatarUrl(avatars?.[(i+1)%avatars.length].src)
      }
    })
  }

  // query for player details in this map //NOTE THAT WHOLE PAGE REFRESH DEPENDS ON THIS HOOK!
  const players = useEntityQuery([Has(BmPlayer), HasValue(BmPlayer, {mapId: mapIdBytes32String})]);
  // const players = runQuery([Has(BmPlayer), HasValue(BmPlayer, {
  //   mapId: mapIdBytes32String
  // })]);

  const items = useEntityQuery([Has(BmItem), HasValue(BmItem, {mapId: mapIdBytes32String})]);
  const itemDetails = items.map((item) => {
    return { ...getComponentValue(BmItem, item)}
  })
  const itemPositions = itemDetails.map((item) => {
    return {x: item.x, y: item.y}
  })

  //const playerRanks = [...players].map((player) => {
  const allPlayerDetails = players.map((player) => {
    const p = getComponentValue(BmPlayer, player)
    //const p = getComponentValueStrict(BmPlayer, player) //just componentValue as the move hook will rerender
    // when things change
    return {
      ...p,
      status: p.dead ? "Dead" : "Alive",
      player: ethers.utils.hexStripZeros(p.player),
      playerentity: player,
      avatar: address?.toLocaleLowerCase() == ethers.utils.hexStripZeros(p.player)?.toLocaleLowerCase() ? 
        avatarUrl??"🐶" : opponentsAvatarUrl??"🐱"
    }
  })

  const winnerFromMapParams = (allPlayerDetails, map)=>{
    const winnerKey = ethers.utils.hexStripZeros(map?.winner).toString().toLowerCase()
    // loop through allPlayerDetails to find winner address where it contains playerentity == winnerKey
    return allPlayerDetails.find((player) => {return player.playerentity == winnerKey})?.player
  }

  const totalStaked = allPlayerDetails.reduce((acc, player) => {
    return acc + parseFloat(fromBn(player?.stake ?? toBn(0)),10)
  }, 0)

  const playerOnlyDetails = allPlayerDetails.filter(
    (player) => {return player.player?.toLowerCase() == address?.toLowerCase()??"0x00"}
    )[0];
  
  const otherPlayerDetails = allPlayerDetails.filter(
    (player) => {return player.player?.toLowerCase() != address?.toLowerCase()??"0x00"}
    )
  const otherPlayerPositions = otherPlayerDetails
  .filter(
    (player) => {return player.status != "Dead"}
    )
  .map((player) => {
    return {x: player.x, y: player.y}
  })

  const checkIncludes = (posArray: Array<T>, pos: {x: number, y: number}) => {
    return posArray.some((p) => {
      return JSON.stringify(p) == JSON.stringify(pos)
    })
  }

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(isConnected) {
      //console.log(toBn(e.currentTarget.stake.value).toString());
      await registerPlayer(mapIdBytes32String, 
        toBn(e.currentTarget.stake.value).toString(),
        address as string
        )
    }

  }

  return (
    <div className="h-full w-full
    flex justify-end items-start
    overflow-y-clip
    ">  
        
        {/* left placeholder */}
        <div className="h-full flex-grow-0 w-1/5
        flex flex-col items-start justify-start
        pl-2
        ">

          <div className="
          flex flex-row items-start
          
          mt-3 w-full
          p-1
          ">
            <span className="
            mx-2 w-[8rem]
            px-2
            ">Room Creator: </span>
            <span className={`
            flex-grow px-3
            `}>
              { addressShortener(
              ethers.utils.hexStripZeros(mapParams?.gamecreatedby)
              )
            }
            </span>
          </div>
          <div className="
            flex flex-row items-start
            w-full
            p-1
            ">
              <span className="
              mx-2 w-[8rem]
              px-2
              ">Players Here: </span>
              <span className={`
              flex-grow px-3
              `}>
                {`${players?.length} / ${mapParams?.playerlimit}`}
              </span>
          </div>
          <div className="
            flex flex-row items-start
            w-full
            p-1
            ">
              <span className="
              mx-2 w-[8rem]
              px-2
              ">Total Staked: </span>
              <span className={`
              flex-grow px-3
              `}>
                {parseFloat(totalStaked, 3)??"??"}
              </span>
          </div>
          <div className="
            flex flex-row items-start
            w-full
            p-1
            ">
              <span className="
              mx-2 w-[8rem]
              px-2
              ">Winner: </span>
              <span className={`
              flex-grow px-3
              `}>
                {`${mapParams?.gameend ? addressShortener(winnerFromMapParams(allPlayerDetails,mapParams)) : "--"}`}
              </span>
          </div>
          <div className="
          flex flex-row items-start
          w-full
          p-1
          ">
            <span className="
            mx-2 w-[8rem]
            px-2
            ">Game Status: </span>
            <span className={`
            flex-grow px-3
            ${
              (mapParams?.gamestart && mapParams?.gameend) ? 
              "text-blue-400" :
              (mapParams?.gamestart && mapParams?.gamepaused) ? "text-orange-500" :
              (mapParams?.gamestart) ? "text-green-500" :
              "text-red-500"} 
            font-bold text-md
            `}>
              {
              (mapParams?.gamestart && mapParams?.gamepaused) ? "Paused" :
              (mapParams?.gamestart && mapParams?.gameend) ? "-- Ended --" :
              mapParams?.gamestart ? "Started":
              "Not Started"
            }</span>
          </div>
          <div className="w-full mt-4 p-1 
          ">
            <p className="
            ml-2 pl-2 pr-4 mt-1
            ">1. Confirm your stake then click "Enter Game" to register yourself for the game.
            </p>
            <p className="
            ml-2 pl-2 pr-4 mt-1
            ">2. Wait for room creator to start game when he clicks the left most red button.
            </p>
            <p className="
            ml-2 pl-2 pr-4 mt-1
            ">3. Move avatar with arrow keys.
            </p>
            <p className="
            ml-2 pl-2 pr-4 mt-1
            ">4. Battle is determined by FT. Health is also interms of FT.
            </p>
            <p className="
            ml-2 pl-2 pr-4 mt-1
            ">5. Powerups may either buff you up or down.
            </p>
            <p className="
            ml-2 pl-2 pr-4 mt-1
            ">6. Last one standing gets all the stake.
            </p>
            <p className="
            ml-2 pl-2 pr-4 mt-1
            ">7. Good Luck Have Fun!
            </p>
          </div>

        </div>

        {/* Game Area */}
        <div className="h-full w-1/2 max-w-1/2 flex flex-col
        justify-start items-center
        
        ">

          {/* Game Board */}
          <div className={`w-full min-h-[44rem] min-w-[44rem] 
          max-h-[44rem] p-4
          overflow-auto
          flex flex-col 
          ${mapHeight>11?"justify-start":"justify-center"} 
          ${mapWidth>14?"items-start":"items-center"}
            `}>
            {rows.map((_, y) => {
              return (
              <div key={`row-${y}`} className="flex justify-start items-center">
                {columns.map((_, x) => {
                return (
                  <div key={`${x}-${y}`} 
                    className="bg-blue-900/30 border border-orange-900
                    min-h-[4rem] min-w-[4rem] 
                    flex justify-center items-center
                    "
                    
                    style={{
                      backgroundImage: `url(${
                        (x==playerOnlyDetails?.x && y==playerOnlyDetails?.y && playerOnlyDetails?.status=="Alive")? 
                        avatarUrl : 
                        checkIncludes(otherPlayerPositions, {x,y})? opponentsAvatarUrl : 
                        checkIncludes(itemPositions, {x,y})? itemUrl
                        : ""
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                    >
                      {(x==playerOnlyDetails?.x && y==playerOnlyDetails?.y)? 
                      
                      null
                      
                      :
                      ""
                      //`${x}-${y}`
                      }
                    </div>
                )
              })}
              </div>
              )
            })}
          </div>

          {/* Controls Panel */}
          <div className="w-full grow 
          flex p-3 items-center
          ">

            <button className="
            bg-red-400 hover:bg-red-600
            h-3/4 w-[6rem]
            px-4
            rounded-2xl border border-red-600
            hover:border-orange-800 hover:border-2
            hover:shadow-lg hover:shadow-red-500
            "
            onClick={() => {
              if (isConnected) {
                startGame(mapIdBytes32String, address as string)
              }
            }}
            >
              Owner Start Game
              </button>

            <form className="h-3/4 w-1/5
            mx-2 flex items-center overflow-y-auto
            border rounded-2xl border-amber-700
            "
            onSubmit={handleSubmit}
            >
                <input type="number" defaultValue={0.1} 
                  name="stake" 
                  className="px-2
                  h-full w-1/2
                  bg-transparent
                  text-white font-semibold
                  text-center
                  rounded-l-2xl
                  "
                  step={0.1}
                  />
                  <button className="
                  h-full w-1/2
                  bg-orange-700 hover:bg-orange-500
                  hover:font-bold
                  hover:border-2 hover:border-orange-600
                  hover:shadow-lg hover:ring-lime-200
                  text-left px-2 text-sm
                  "
                  
                  type="submit"
                  >
                    {isConnected? "Confirm Stake and Enter Game":"Connect Wallet to Register for Game"}
                    </button>

            </form>
            <div className="
            flex w-fit h-3/4 overflow-y-auto
            bg-yellow-600 hover:bg-yellow-400
            px-2 py-2
            rounded-2xl
            ">
              <img 
                  className="h-[4.5rem] w-[4.5rem]
                  rounded-l-lg
                  "
                  src={avatarUrl}/>
              <select className="h-full text-black
              bg-transparent focus:outline-none
              "
              defaultValue={0}
              onChange={(e) => {handleAvatarSelect(e)}}
              >
                <option key={0}>Choose Avatar</option>
                  {/* <option value="Warrior1">
                    warriror1
                  </option> */}
                {avatars.map((avatar, i) => {
                  return (
                    <option key={i+1} value={avatar?.name}>
                      {avatar?.name?? "??"}
                    </option>
                  )
                  })
                }
              </select>
            </div>

          </div>

        </div>
        
        {/* Side Bar Rank and Chat */}
        <div className="h-full w-1/3
        px-4
        flex flex-col
        overflow-y-auto
        ">

          {/* Rank */}
          <RankMonitor playerRanks={allPlayerDetails}/>

          {/* Chat */}
          <div className="mt-3 mb-9
            h-full
            flex flex-col
            overflow-y-auto
          ">
            <ChatBox room={mapId} msgLimit={0}/>
          </div>

          {/* <GameChatBox/> */}
          
        </div>
      </div>
  )
  
}

export default GameRoom
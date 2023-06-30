import React, {useState, useEffect} from 'react';
import { useEntityQuery } from '@latticexyz/react';
import { Entity, runQuery, Has, HasValue, NotValue, getComponentValueStrict, getComponentValue } from "@latticexyz/recs";
import { useMUD } from '../../MUDContext';
import RoomCard from '../../components/RoomCard';
import ChatBox from '../../components/ChatBox/ChatBox';
import {ethers} from 'ethers';
import { addressShortener } from '../../utils/addressShortener';
import {useSetAtom} from 'jotai';
import { createWorldModalAtom } from '../../store';
import { firebase, db } from '../../firebase.config';
import { addDoc, collection, serverTimestamp, 
  onSnapshot, query, where } from 'firebase/firestore';
import { useAccount } from 'wagmi';
import { DECIMAL } from '../../constants';
import {toBn, fromBn} from "evm-bn";
import { padToBytes32 } from '../../utils/byteutils';

const Home = () => {
  const {
    components: { BattleMap }
  } = useMUD();

  const gameCreator = (gamecreatedby: string) => {
    return addressShortener(ethers.utils.hexStripZeros(gamecreatedby, 32))
  }
  
  const battleMaps = useEntityQuery([Has(BattleMap), NotValue(BattleMap, {gameend: true})]).map((entity) => {
    const b = getComponentValue(BattleMap, entity)
          
    return {...b, 
              entity,
              stake: fromBn(b?.stake),
              roomNumber: parseInt(entity)
            }
  });

  const setCreateGameModalVisible = useSetAtom(createWorldModalAtom);

  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState([]);

  const messageRef = collection(db, "messages");
  const { address, isConnected } = useAccount();
  useEffect(() => {
    const queryMessages = query(messageRef, where("room", "==", "lobby1"));
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({...doc.data(), id: doc.id})
      });
      setMessages(messages);
    });

    return () => unsuscribe();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMsg === '') return;

    await addDoc(messageRef, {
      text: newMsg,
      createdAt: serverTimestamp(),
      room: 'lobby1',
      user: addressShortener(address?? "anon-user88")
    })

    setNewMsg('');
    }
  
  return (
    <div className="w-full h-full
    flex justify-center items-start
    overflow-y-auto
    ">
    
    
      <div className="flex flex-col items-center
        w-1/2 h-5/6 mt-5
        overflow-y-auto
      ">
      
        {/* Title bar */}
        <div className="w-full
        flex flex-row justify-between items-center">
          <div className="mx-2 text-lg font-bold">Game Lobby</div>
          <button className={`m-2 mb-4 
            ${isConnected?"bg-orange-500":"bg-red-400"} hover:bg-orange-700
            border rounded-lg p-2`}
            onClick={() => {
              return isConnected?
              setCreateGameModalVisible(true): null }}
            >{isConnected ? "Create Game": "Connect Wallet to Create Game"}</button>
        </div>

          {/* room screen */}
          <div className="w-full h-full flex flex-col items-center
          rounded-lg
          overflow-y-auto
          ">

            <div className="w-full flex items-center
              py-1 bg-[#282828]
              flex-nowrap text-center
              border rounded-t-lg 
            ">
              <div className="w-[5rem] px-2">Game</div>
              <div className="w-[12rem] text-left pl-4">Game Name</div>
              <div className="w-[7rem]">Stake</div>
              <div className="w-[7rem]">Format</div>
              <div className="w-[11.5rem]">Host</div>
              <div className="w-[7rem]">Players</div>
              <div className="flex flex-grow justify-center">Status</div>
            </div>

            {/* room cards */}
            <div className="w-full h-2/3
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
                    roomName={bm.roomname}
                    stake= {bm.stake}
                    format={`${bm.width} x ${bm.height}`}
                    host={gameCreator(bm.gamecreatedby)}
                    players={bm.playerlimit}
                    status={bm.gamestart}
                  />)
                })
              }
            </div>


            <ChatBox room={"lobby1"}/>
          </div>
      
      
      </div>
    </div>
  )
}

export default Home
import React, {useEffect, useState, useRef} from 'react';
import {firebase, db} from '../../firebase.config';
import { addDoc, collection, serverTimestamp, 
    onSnapshot, query, where, orderBy, limitToLast } from 'firebase/firestore';
import { useAccount } from 'wagmi';
import { addressShortener } from '../../utils/addressShortener';

const ChatBox = ({room, msgLimit=100}) => {

    const [newMsg, setNewMsg] = useState('');
    const [messages, setMessages] = useState([]);
    const messageRef = collection(db, "messages");
    const { address, isConnected } = useAccount();
    const chatBoxRef = useRef(null);
    useEffect(() => {
        try {
        const queryMessages = msgLimit>0 ? query(messageRef, 
            where("room", "==", room),
            orderBy("createdAt", "desc"),
            limitToLast(msgLimit)
            )
            :
            query(messageRef,
                where("room", "==", room),
                orderBy("createdAt", "desc")
            )
            ;
        const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
            messages.push({...doc.data(), id: doc.id})
            });
            setMessages(messages);
            
        });

        return () => unsuscribe();
        } catch (error) {
            console.log(error)
            setMessages([...messages, {user: "error", text: "error in chat backend"}])
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMsg === '') return;
    
        await addDoc(messageRef, {
            text: newMsg,
            createdAt: serverTimestamp(),
            room: room,
            user: address?? "anon-user88"
        })
    
        setNewMsg('');
    }

    useEffect(() => {
        if(chatBoxRef.current){
            chatBoxRef.current.scrollTop = 0;
        }
    }, [messages])
    
    console.log(chatBoxRef.current?.scrollHeight);
    console.log(chatBoxRef.current?.scrollTop);
    return (
        <div className="w-full h-full bg-slate-700/20
                flex flex-col justify-start
                px-4 pt-1
                border rounded-b-lg
                overflow-y-auto
                ">

                {/* chat screen */}
                <div className="w-full my-2 
                grow
                py-3 px-4
                bg-black/20
                flex flex-col-reverse justify-start
                overflow-y-auto
                rounded-lg 
                "
                ref={chatBoxRef}
                >
                    {
                    messages.map((msg) => {
                        return(
                                <div key={msg.id} className="w-full 
                                px-2
                                ">
                    <span className={`${
                        isConnected?
                        (msg.user==address?
                        "text-orange-400"
                        : ""): ""
                        }`}>{addressShortener(msg.user)}: </span>
                                <span className="mx-2">{msg.text}</span>
                                </div>
                    )}
                    )
                    }
                </div>

                {/* chat input */}
                <form className="flex
                h-[4.2rem]
                mt-auto mb-4 pr-1 py-1
                bg-transparent
                    text-white
                    border rounded-lg
                "
                onSubmit={handleSubmit}
                >
                    <input className={`
                        mx-2 grow p-1 px-4
                        bg-transparent whitespace-normal
                        overflow-y-auto outline-offset-0
                        outline-none
                        ${isConnected?"":"text-lg placeholder:text-red-600"}
                        `}
                        onChange={(e) => isConnected?setNewMsg(e.target.value):null}
                        value={newMsg}
                        placeholder={isConnected?"Type a message...":"Pls connect wallet to chat."}
                        ></input>
                        <button className="
                        h-full w-[5rem]
                        border rounded-lg
                        hover:bg-white/50
                        "
                        type="submit"
                        >
                            Enter
                        </button>
                    </form>
                </div>
    )
}

export default ChatBox
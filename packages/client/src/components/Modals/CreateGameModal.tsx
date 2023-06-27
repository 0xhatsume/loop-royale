import React from 'react';
import Modal from './Modal';
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { createWorldModalAtom } from '../../store';
import { useMUD } from '../../MUDContext';


const CreateGameModal = () => {

    const {
        systemCalls: { createGame },
    } = useMUD();

    const [worldModalVisible, setWorldModalVisible] = useAtom(createWorldModalAtom);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const roomname = e.currentTarget.roomname.value;
        const boardheight = e.currentTarget.boardheight.value;
        const boardwidth = e.currentTarget.boardwidth.value;
        const gameplayernums = e.currentTarget.gameplayernums.value;
        const minstake = e.currentTarget.minstake.value;

        createGame(parseInt(boardwidth),parseInt(boardheight)).then(
            setWorldModalVisible(false)
        )
    }

    return (
        <Modal visible={worldModalVisible}>
            <form className="w-1/4 h-1/2 
            flex flex-col justify-start items-center
            p-5
            bg-[#eebd9f]/90 
            text-amber-950 font-semibold
            border-2 rounded-lg border-amber-950
            shadow-2xl shadow-white/80
            "
            onSubmit={handleSubmit}
            >
                
                
                <div className="my-5 
                text-lg font-bold text-orange-950">
                    Create Game
                </div>
                
                <div className="
                    flex justify-between items-center
                    p-2 w-4/5 mb-2
                    border rounded-lg border-amber-950">
                    
                    <label className="px-2 whitespace-nowrap">Room:</label>
                    <input id="roomname" name="roomname" type="text"
                        required
                        placeholder="Enter Room Name..."
                        className="mx-1
                        placeholder:text-orange-950/60
                        p-1 px-2
                        rounded-lg border border-amber-950" />
                    </div>

                <div className="
                    flex justify-between items-center
                    p-2 w-4/5 my-2
                    border rounded-lg border-amber-950">
                    
                    <label className="px-2">Board Size:</label>
                    <input id="boardheight" name="boardheight" type="number" 
                        defaultValue={10} step={1}
                        className="mx-2 w-[4rem] 
                        p-1 text-end
                        rounded-lg border border-amber-950" />
                    <span>x</span>
                    <input id="boardwidth" name="boardwidth" type="number" 
                        defaultValue={10} step={1}
                        className="mx-2 w-[4rem] 
                        p-1 text-end
                        rounded-lg border border-amber-950" />
                    </div>
                
                <div className="
                    flex justify-between items-center
                    p-2 w-4/5 my-2
                    border rounded-lg border-amber-950">
                    
                    <label className="px-2">Number of Players:</label>
                    <input id="gameplayernums" name="gameplayernums" type="number" 
                        defaultValue={2} step={1}
                        className="mx-2 w-[3rem] 
                        p-1 text-end
                        rounded-lg border border-amber-950" />
                    </div>
                
                <div className="
                    flex justify-between items-center
                    p-2 w-4/5 my-2
                    border rounded-lg border-amber-950">
                    
                    <label className="px-2">Minimum Stake:</label>
                    <span className="mx-2 mr-4">
                    <input id="minstake" name="minstake" type="number" 
                        defaultValue={0.1} step={0.1}
                        className="mx-2 w-[5rem]
                        p-1 text-end
                        rounded-lg border border-amber-950" />
                    ETH</span>
                    </div>
                
                <button className="
                w-4/5 p-2 mt-4 mb-2
                text-white
                bg-orange-600 hover:bg-orange-400
                border rounded-lg border-gray-800
                "
                type="submit"
                >Create Room</button>


            </form>
        </Modal>
    )
}

export default CreateGameModal
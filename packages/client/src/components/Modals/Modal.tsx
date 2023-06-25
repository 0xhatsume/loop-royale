import React from 'react';
import { useSetAtom } from "jotai";
import { createWorldModalAtom } from '../../store';

const Modal = ({visible, children}) => {
    if(!visible) return null;
    
    const setWorldModalVisible = useSetAtom(createWorldModalAtom)
    const handleBackdropClick = (e: React.MouseEvent<HTMLElement>) => {
        if(e.target.id === "modalContainer"){
            setWorldModalVisible(false);
        }
    }
    return (
        <div id="modalContainer" className="fixed inset-0 z-50 
        flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={handleBackdropClick}
        >
            {children}
        </div>
    )
}

export default Modal
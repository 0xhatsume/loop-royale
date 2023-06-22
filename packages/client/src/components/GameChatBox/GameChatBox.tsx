import React from 'react'

const GameChatBox = () => {
    return (
    <div className="w-full flex-grow
        mt-3 mb-9 p-2
        border rounded-lg
        flex flex-col
        ">

        {/* Chat History */}
        <div className="w-full h-full
        bg-blue-900/30 rounded-lg
        px-3 py-2 mb-2
        ">
            
        </div>
        
        <div className="relative my-1">
            <input type="text" className="w-full h-[3.5rem] 
            bg-white/10 focus:bg-white/30 
            placeholder:text-[#5F5453]/50 
            border border-white/20
            text-white/70 placeholder-white/50 focus:text-white
            focus:border-white 
            rounded-md 
            px-4 py-1.5
            focus:outline-none
            "/>
                
                <span className="absolute right-0 top-0 h-full 
                px-2 hover:bg-white/50 rounded-lg
                flex justify-center items-center">
                <button className="text-white/30 focus:text-white 
                    h-full flex items-center justify-center">
                    <svg className="h-5 w-12" viewBox="0 0 364 322">
                    <g opacity="1">
                        <path
                        d="M300.161 201.899C300.2 136.634 247.323 83.6947 
                        182.058 83.6559C116.793 83.617 63.8535 136.493 63.8147 
                        201.759L-18.9065 201.709C-18.8404 90.7585 71.1566 0.868666 
                        182.107 0.934744C293.058 1.00082 382.948 90.9978 382.882 201.949L300.161 
                        201.899Z"
                        fill="currentColor"
                        />
                        <path
                        d="M62.6579 201.758C62.6187 267.661 116.014 321.118
                        181.915 321.157C247.816 321.196 301.275 267.803 301.314
                        201.9L62.6579 201.758Z"
                        fill="currentColor"
                        />
                    </g>
                    </svg>
                </button>
                </span>
            </div>


        </div>
    )
}

export default GameChatBox
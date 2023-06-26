import React from 'react';
import ConnectWallet from '../ConnectWallet';
import { Link } from 'react-router-dom';

const NavBar = () => {

  return (
    <nav className="bg-transparent flex flex-row items-center
    justify-between
    h-20 w-full z-20
    ">

      {/* title and logo */}
      <Link to={"/"} className="mx-5 flex items-center
      text-2xl font-bold align-top
      py-4 px-4
      border-b border-l rounded-2xl
      ">
        Loop Royale
        </Link>

      {/* connect wallet button */}
      <div className="mr-12">
        <ConnectWallet/>
      </div>
      
    </nav>
  )
}

export default NavBar
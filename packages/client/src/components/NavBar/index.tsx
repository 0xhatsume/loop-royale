import React from 'react';
import ConnectWallet from '../ConnectWallet';

const NavBar = () => {

  return (
    <nav className="bg-transparent flex flex-row items-center
    justify-between
    h-20 w-full z-20
    ">

      {/* title and logo */}
      <div></div>

      {/* connect wallet button */}
      <div className="mr-12">
        <ConnectWallet/>
      </div>
      
    </nav>
  )
}

export default NavBar
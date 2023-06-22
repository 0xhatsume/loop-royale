import React from 'react';
import ConnectWallet from '../ConnectWallet';
import { useMUD } from '../../MUDContext';

const NavBar = () => {

  const {
    network: { singletonEntity },
  } = useMUD();
  
  return (
    <nav className="bg-transparent flex flex-row items-center
    justify-between
    h-20 w-full
    ">

      {/* title and logo */}
      <div></div>

      {/* connect wallet button */}
      <div className="mr-8">
        <ConnectWallet/>
      </div>
      
    </nav>
  )
}

export default NavBar
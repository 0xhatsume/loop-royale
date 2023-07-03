import React from 'react';
import { useAccount, useConnect, useEnsName, useDisconnect, Partial } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { addressShortener } from '../../utils/addressShortener';

const ConnectWallet = () => {
    const { address, isConnected } = useAccount()
    const { data: ensName } = useEnsName({ address })
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()

    const shortAddress = addressShortener(address as string)
    
    const handleConnect = () => {
        !isConnected ? connect({ connector: connectors[0] }) : disconnect();
    }

    return (
        <button className="
    px-4 py-2 border rounded-lg
    bg-orange-500 hover:bg-orange-700
    "
            onClick={() => handleConnect()}
        >{isConnected ? (ensName ?? shortAddress) : "Connect Wallet"}</button>
    )
}

export default ConnectWallet
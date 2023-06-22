import React from 'react';
import { useAccount, useConnect, useEnsName, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { addressShortener } from '../../utils/addressShortener';

const ConnectWallet = () => {
    const { address, isConnected } = useAccount()
    const { data: ensName } = useEnsName({ address })
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    const shortAddress = addressShortener(address)

    const handleConnect = () => {
        !isConnected ? connect() : disconnect();
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
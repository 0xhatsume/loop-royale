import { MUDChain, latticeTestnet } from "@latticexyz/common/chains";
import { foundry, Chain } from "@wagmi/chains";

export const bladedao = {
    id: 1011365,
    name: 'BladeDAO',
    network: 'bladedao',
    nativeCurrency: {
        decimals: 18,
        name: 'Blade',
        symbol: 'BLADE',
    },
    rpcUrls: {
      default: {
        http: ['https://flashlayer.alt.technology/bladedao74eb1498/rpc'],
        webSocket: ['wss://flashlayer.alt.technology/bladedao74eb1498/ws'],
      },
      public: {
        http: ['https://flashlayer.alt.technology/bladedao74eb1498/rpc'],
        webSocket: ['wss://flashlayer.alt.technology/bladedao74eb1498/ws'],
      },
    },

    blockExplorers: {
        default: { name: 'Bladescan', url: 'https://explorer.alt.technology?rpcUrl=https://flashlayer.alt.technology/bladedao74eb1498/rpc' },
    },

} as const satisfies Chain

// If you are deploying to chains other than anvil or Lattice testnet, add them here
export const supportedChains: MUDChain[] = [foundry, latticeTestnet];

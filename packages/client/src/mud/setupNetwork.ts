import { setupMUDV2Network } from "@latticexyz/std-client";
import { createFastTxExecutor, createFaucetService, getSnapSyncRecords  } from "@latticexyz/network";
import { getNetworkConfig } from "./getNetworkConfig";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { Contract, Signer, providers, utils } from "ethers";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { IWorld__factory } from "contracts/types/ethers-contracts/factories/IWorld__factory";
import { getTableIds } from "@latticexyz/utils";
import storeConfig from "contracts/mud.config";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork() {
  const contractComponents = defineContractComponents(world);
  const networkConfig = await getNetworkConfig();
  const result = await setupMUDV2Network<
    typeof contractComponents,
    typeof storeConfig
  >({
    networkConfig,
    world,
    contractComponents,
    syncThread: "main",
    worldAbi: IWorld__factory.abi,
    storeConfig,
  });

  //result.startSync();

  // Request drip from faucet
  const signer = result.network.signer.get();
  const provider = result.network.providers.get().json;
  //const metamaskProvider = new Web3Provider((window as any).ethereum); // comment away if need origin config
  //const metamaskSigner = metamaskProvider.getSigner(); // comment away if need origin config
  const signerOrProvider = signer ?? provider; //origin config
  //const signerOrProvider = metamaskSigner ?? signer ?? provider; // comment away if need origin config

  // if (networkConfig.faucetServiceUrl && signer) {
  //   const address = await signer.getAddress();
  //   console.info("[Dev Faucet]: Player address -> ", address);

  //   const faucet = createFaucetService(networkConfig.faucetServiceUrl);

  //   const requestDrip = async () => {
  //     const balance = await signer.getBalance();
  //     console.info(`[Dev Faucet]: Player balance -> ${balance}`);
  //     const lowBalance = balance?.lte(utils.parseEther("1"));
  //     if (lowBalance) {
  //       console.info("[Dev Faucet]: Balance is low, dripping funds to player");
  //       // Double drip
  //       await faucet.dripDev({ address });
  //       await faucet.dripDev({ address });
  //     }
  //   };

  //   requestDrip();
  //   // Request a drip every 20 seconds
  //   setInterval(requestDrip, 20000);
  // }

  // Create a World contract instance
  const worldContract = IWorld__factory.connect(
    networkConfig.worldAddress,
    //signer ?? result.network.providers.get().json,
    signerOrProvider
  );
  
  if (networkConfig.snapSync) {
    const currentBlockNumber = await provider.getBlockNumber();
    const tableRecords = await getSnapSyncRecords(
      networkConfig.worldAddress,
      getTableIds(storeConfig),
      currentBlockNumber,
      signerOrProvider
    );

    console.log(`Syncing ${tableRecords.length} records`);
    result.startSync(tableRecords, currentBlockNumber);
  } else {
    result.startSync();
  }

  // Create a fast tx executor
  const fastTxExecutor =
    signer?.provider instanceof JsonRpcProvider
      ? await createFastTxExecutor(
          //signer as Signer & { provider: JsonRpcProvider }
          signerOrProvider as Signer & { provider: JsonRpcProvider }
        )
      : null;

  // TODO: infer this from fastTxExecute signature?
  type BoundFastTxExecuteFn<C extends Contract> = <F extends keyof C>(
    func: F,
    args: Parameters<C[F]>,
    options?: {
      retryCount?: number;
    }
  ) => Promise<ReturnType<C[F]>>;

  function bindFastTxExecute<C extends Contract>(contract: C): BoundFastTxExecuteFn<C> {
    return async function (...args) {
      if (!fastTxExecutor) {
        throw new Error("no signer");
      }
      const { tx } = await fastTxExecutor.fastTxExecute(contract, ...args);
      return await tx;
    };
  }

  const worldSend = bindFastTxExecute(worldContract);

  return {
    ...result,
    worldContract,
    worldSend,
    fastTxExecutor,
  };
}

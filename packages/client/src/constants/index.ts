import { ethers } from "ethers";

const DECIMALS = 18;
export const DECIMAL = ethers.BigNumber.from(10).pow(DECIMALS);

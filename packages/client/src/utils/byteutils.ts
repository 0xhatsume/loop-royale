import {ethers} from 'ethers';

export const padToBytes32 = (n: string) => {
    return ethers.utils.hexZeroPad(n, 32);
}
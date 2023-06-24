// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

function mapAndentityToEntityKey(bytes32 mapId, bytes32 entity) pure returns (bytes32) {
    return keccak256(abi.encode(mapId, entity));
}

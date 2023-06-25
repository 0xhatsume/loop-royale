// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

// Import schema type
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16(""), bytes16("SpawnPos")));
bytes32 constant SpawnPosTableId = _tableId;

library SpawnPos {
  /** Get the table's schema */
  function getSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](2);
    _schema[0] = SchemaType.UINT32_ARRAY;
    _schema[1] = SchemaType.UINT32_ARRAY;

    return SchemaLib.encode(_schema);
  }

  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](1);
    _schema[0] = SchemaType.BYTES32;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's metadata */
  function getMetadata() internal pure returns (string memory, string[] memory) {
    string[] memory _fieldNames = new string[](2);
    _fieldNames[0] = "x";
    _fieldNames[1] = "y";
    return ("SpawnPos", _fieldNames);
  }

  /** Register the table's schema */
  function registerSchema() internal {
    StoreSwitch.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Register the table's schema (using the specified store) */
  function registerSchema(IStore _store) internal {
    _store.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Set the table's metadata */
  function setMetadata() internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    StoreSwitch.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Set the table's metadata (using the specified store) */
  function setMetadata(IStore _store) internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    _store.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Get x */
  function getX(bytes32 key) internal view returns (uint32[] memory x) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_uint32());
  }

  /** Get x (using the specified store) */
  function getX(IStore _store, bytes32 key) internal view returns (uint32[] memory x) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_uint32());
  }

  /** Set x */
  function setX(bytes32 key, uint32[] memory x) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 0, EncodeArray.encode((x)));
  }

  /** Set x (using the specified store) */
  function setX(IStore _store, bytes32 key, uint32[] memory x) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 0, EncodeArray.encode((x)));
  }

  /** Get the length of x */
  function lengthX(bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    uint256 _byteLength = StoreSwitch.getFieldLength(_tableId, _keyTuple, 0, getSchema());
    return _byteLength / 4;
  }

  /** Get the length of x (using the specified store) */
  function lengthX(IStore _store, bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    uint256 _byteLength = _store.getFieldLength(_tableId, _keyTuple, 0, getSchema());
    return _byteLength / 4;
  }

  /** Get an item of x (unchecked, returns invalid data if index overflows) */
  function getItemX(bytes32 key, uint256 _index) internal view returns (uint32) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getFieldSlice(_tableId, _keyTuple, 0, getSchema(), _index * 4, (_index + 1) * 4);
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Get an item of x (using the specified store) (unchecked, returns invalid data if index overflows) */
  function getItemX(IStore _store, bytes32 key, uint256 _index) internal view returns (uint32) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getFieldSlice(_tableId, _keyTuple, 0, getSchema(), _index * 4, (_index + 1) * 4);
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Push an element to x */
  function pushX(bytes32 key, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.pushToField(_tableId, _keyTuple, 0, abi.encodePacked((_element)));
  }

  /** Push an element to x (using the specified store) */
  function pushX(IStore _store, bytes32 key, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.pushToField(_tableId, _keyTuple, 0, abi.encodePacked((_element)));
  }

  /** Pop an element from x */
  function popX(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.popFromField(_tableId, _keyTuple, 0, 4);
  }

  /** Pop an element from x (using the specified store) */
  function popX(IStore _store, bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.popFromField(_tableId, _keyTuple, 0, 4);
  }

  /** Update an element of x at `_index` */
  function updateX(bytes32 key, uint256 _index, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.updateInField(_tableId, _keyTuple, 0, _index * 4, abi.encodePacked((_element)));
  }

  /** Update an element of x (using the specified store) at `_index` */
  function updateX(IStore _store, bytes32 key, uint256 _index, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.updateInField(_tableId, _keyTuple, 0, _index * 4, abi.encodePacked((_element)));
  }

  /** Get y */
  function getY(bytes32 key) internal view returns (uint32[] memory y) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 1);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_uint32());
  }

  /** Get y (using the specified store) */
  function getY(IStore _store, bytes32 key) internal view returns (uint32[] memory y) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 1);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_uint32());
  }

  /** Set y */
  function setY(bytes32 key, uint32[] memory y) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 1, EncodeArray.encode((y)));
  }

  /** Set y (using the specified store) */
  function setY(IStore _store, bytes32 key, uint32[] memory y) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 1, EncodeArray.encode((y)));
  }

  /** Get the length of y */
  function lengthY(bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    uint256 _byteLength = StoreSwitch.getFieldLength(_tableId, _keyTuple, 1, getSchema());
    return _byteLength / 4;
  }

  /** Get the length of y (using the specified store) */
  function lengthY(IStore _store, bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    uint256 _byteLength = _store.getFieldLength(_tableId, _keyTuple, 1, getSchema());
    return _byteLength / 4;
  }

  /** Get an item of y (unchecked, returns invalid data if index overflows) */
  function getItemY(bytes32 key, uint256 _index) internal view returns (uint32) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getFieldSlice(_tableId, _keyTuple, 1, getSchema(), _index * 4, (_index + 1) * 4);
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Get an item of y (using the specified store) (unchecked, returns invalid data if index overflows) */
  function getItemY(IStore _store, bytes32 key, uint256 _index) internal view returns (uint32) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getFieldSlice(_tableId, _keyTuple, 1, getSchema(), _index * 4, (_index + 1) * 4);
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Push an element to y */
  function pushY(bytes32 key, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.pushToField(_tableId, _keyTuple, 1, abi.encodePacked((_element)));
  }

  /** Push an element to y (using the specified store) */
  function pushY(IStore _store, bytes32 key, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.pushToField(_tableId, _keyTuple, 1, abi.encodePacked((_element)));
  }

  /** Pop an element from y */
  function popY(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.popFromField(_tableId, _keyTuple, 1, 4);
  }

  /** Pop an element from y (using the specified store) */
  function popY(IStore _store, bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.popFromField(_tableId, _keyTuple, 1, 4);
  }

  /** Update an element of y at `_index` */
  function updateY(bytes32 key, uint256 _index, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.updateInField(_tableId, _keyTuple, 1, _index * 4, abi.encodePacked((_element)));
  }

  /** Update an element of y (using the specified store) at `_index` */
  function updateY(IStore _store, bytes32 key, uint256 _index, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.updateInField(_tableId, _keyTuple, 1, _index * 4, abi.encodePacked((_element)));
  }

  /** Get the full data */
  function get(bytes32 key) internal view returns (uint32[] memory x, uint32[] memory y) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Get the full data (using the specified store) */
  function get(IStore _store, bytes32 key) internal view returns (uint32[] memory x, uint32[] memory y) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Set the full data using individual values */
  function set(bytes32 key, uint32[] memory x, uint32[] memory y) internal {
    bytes memory _data = encode(x, y);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using individual values (using the specified store) */
  function set(IStore _store, bytes32 key, uint32[] memory x, uint32[] memory y) internal {
    bytes memory _data = encode(x, y);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setRecord(_tableId, _keyTuple, _data);
  }

  /** Decode the tightly packed blob using this table's schema */
  function decode(bytes memory _blob) internal view returns (uint32[] memory x, uint32[] memory y) {
    // 0 is the total byte length of static data
    PackedCounter _encodedLengths = PackedCounter.wrap(Bytes.slice32(_blob, 0));

    // Store trims the blob if dynamic fields are all empty
    if (_blob.length > 0) {
      uint256 _start;
      // skip static data length + dynamic lengths word
      uint256 _end = 32;

      _start = _end;
      _end += _encodedLengths.atIndex(0);
      x = (SliceLib.getSubslice(_blob, _start, _end).decodeArray_uint32());

      _start = _end;
      _end += _encodedLengths.atIndex(1);
      y = (SliceLib.getSubslice(_blob, _start, _end).decodeArray_uint32());
    }
  }

  /** Tightly pack full data using this table's schema */
  function encode(uint32[] memory x, uint32[] memory y) internal view returns (bytes memory) {
    uint40[] memory _counters = new uint40[](2);
    _counters[0] = uint40(x.length * 4);
    _counters[1] = uint40(y.length * 4);
    PackedCounter _encodedLengths = PackedCounterLib.pack(_counters);

    return abi.encodePacked(_encodedLengths.unwrap(), EncodeArray.encode((x)), EncodeArray.encode((y)));
  }

  /** Encode keys as a bytes32 array using this table's schema */
  function encodeKeyTuple(bytes32 key) internal pure returns (bytes32[] memory _keyTuple) {
    _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));
  }

  /* Delete all data for given keys */
  function deleteRecord(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store, bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.deleteRecord(_tableId, _keyTuple);
  }
}
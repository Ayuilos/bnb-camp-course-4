//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

library Impl2Storage {
    struct Storage {
        uint256 value;
        bool flag;
    }

    bytes32 private constant implStorageSlot = keccak256("impl2.storage");

    function getStore() internal pure returns (Storage storage s) {
        bytes32 position = implStorageSlot;
        assembly {
            s.slot := position
        }
    }
}

contract Impl2 {
    uint256 private constant cValue = 2;

    function getState() internal pure returns (Impl2Storage.Storage storage s) {
        return Impl2Storage.getStore();
    }

    function init() external {
        Impl2Storage.Storage storage s = getState();
        if (!s.flag) {
            s.value = 10;
            s.flag = true;
        }
    }

    function getCValue() public pure returns (uint256) {
        return cValue;
    }

    function getValue() public view returns (uint256) {
        return getState().value + 1;
    }

    function setValue(uint256 newValue) external {
        getState().value = newValue;
    }
}

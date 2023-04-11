//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

library Impl1Storage {
    struct Storage {
        uint256 value;
        bool flag;
    }

    bytes32 private constant implStorageSlot = keccak256("impl1.storage");

    function getStore() internal pure returns (Storage storage s) {
        bytes32 position = implStorageSlot;
        assembly {
            s.slot := position
        }
    }
}

contract Impl1 {
    uint256 private constant cValue = 1;

    function getState() internal pure returns (Impl1Storage.Storage storage s) {
        return Impl1Storage.getStore();
    }

    function init() external {
        Impl1Storage.Storage storage s = getState();
        if (!s.flag) {
            s.value = 100;
            s.flag = true;
        }
    }

    function getCValue() public pure returns (uint256) {
        return cValue;
    }

    function getValue() public view returns (uint256) {
        return getState().value;
    }

    function setValue(uint256 newValue) external {
        getState().value = newValue;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDeposit} from "./IDeposit.sol";

contract SafeProtocol {
    IDeposit private vulnerableContract;

    constructor(address payable _vulnerableContractAddress) {
        vulnerableContract = IDeposit(_vulnerableContractAddress);
    }

    function safeDeposit() public payable {
        vulnerableContract.deposit{value: msg.value}();
    }

    function safeWithdraw(uint256 _amount) public {
        vulnerableContract.withdraw(_amount);
    }
}

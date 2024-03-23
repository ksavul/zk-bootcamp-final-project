// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDeposit} from "./IDeposit.sol";

contract ReentrancyVulnerable is IDeposit {
	mapping(address => uint256) public balances;

	function deposit() public payable {
		balances[msg.sender] += msg.value;
	}

	function withdraw(uint256 _amount) public {
		require(balances[msg.sender] >= _amount, "Insufficient balance");
		(bool sent, ) = msg.sender.call{ value: _amount }("");
		require(sent, "Failed to send Ether");
		balances[msg.sender] -= _amount;
	}

	receive() external payable {}
}

// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.4;

interface IDeposit {
    function deposit() external payable;
    function withdraw(uint256 _amount) external;
    function balances(address user) external view returns (uint256);
}
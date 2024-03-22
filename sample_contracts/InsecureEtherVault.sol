pragma solidity 0.8.12;

contract InsecureEtherVault {
  
  mapping(address => uint256) private userBalances;

  function deposit() external payable {
    userBalances[msg.sender] = userBalances[msg.sender]+ msg.value;
  }

  function withdrawAll() external {
    uint256 balance = getUserBalance(msg.sender);
    require(balance > 0, "Insufficient balance");

    (bool result,) = msg.sender.call{value: balance}("");
    require(success, "Failed to send Ether");

    userBalances[msg.sender] = 0;
  }

  function getBalance() external view returns (uint256) {
    return address(this).balance;
  }

   function getUserBalance(address _user) external view returns (uint256) {
    return userBalances[_user];
  }

}
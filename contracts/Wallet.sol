// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import './Coin.sol';

contract Wallet is Ownable {
    Coin public coin;
    mapping(address => uint) public allowance;

    constructor(Coin _coin) {
      coin = _coin;
    }

    function renewAllowance(address _user, uint _allowance) public onlyOwner {
        allowance[_user] = _allowance;
    }

    function spendCoins(address _receiver, uint _amount) public {
        require(_amount <= allowance[msg.sender], "Allowance not sufficient");
        coin.transfer(_receiver, _amount);
        allowance[msg.sender] -= _amount;
    }
}
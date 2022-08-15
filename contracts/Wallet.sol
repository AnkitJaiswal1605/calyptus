// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import './Coin.sol';

contract Wallet is Ownable {
    Coin public coin;
    mapping(address => User) public users;

    struct User {
        address userAddress;
        uint allowance;
        uint validity;
    }

    event AllowanceRenewed(address indexed user, uint allowance, uint timeLimit);
    event CoinsSpent(address indexed receiver, uint amount);

    modifier checkAllowance(uint _amount) {
        User memory user = users[msg.sender];
        require(_amount <= user.allowance, "Allowance not sufficient!!");
        _;
    }

    constructor(Coin _coin) {
        coin = _coin;
    }

    function renewAllowance(address _user, uint _allowance, uint _timeLimit) public onlyOwner {
        uint validity = block.timestamp + _timeLimit;
        users[_user] = User(_user, _allowance, validity);
        emit AllowanceRenewed(_user, _allowance, _timeLimit);
    }

    function spendCoins(address _receiver, uint _amount) public checkAllowance(_amount) {
        User storage user = users[msg.sender];
        require(block.timestamp <= user.validity, "Validity expired!!");
        coin.transfer(_receiver, _amount);
        user.allowance -= _amount;
        emit CoinsSpent(_receiver, _amount);
    }
}
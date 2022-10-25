// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

// Importing the ReentrancyGuard from openzeppelin to protect against reentrancy.
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Importing Coin contract to create an instance of it.
import './Coin.sol';

// This contract will store the total supply of coins.
// The total supply will be transferred to this contract from the owner while deploying it.
// Then this contract can be used to renew allowance for users by the owner, and spending of coins by the users.
contract Wallet is Ownable, ReentrancyGuard {
    Coin public coin;
    // Mapping users will store the user data against his/her address.
    mapping(address => User) public users;

    // Struct to store user data -- Address, allowance and validity.
    struct User {
        address userAddress;
        uint allowance;
        uint validity;
    }

    // Events to be emitted when allowance is renewed and coins are spent.
    event AllowanceRenewed(address indexed user, uint allowance, uint timeLimit);
    event CoinsSpent(address indexed receiver, uint amount);

    // This modifier will check if the user has sufficient allowance before spending the coins.
    modifier checkAllowance(uint _amount) {
        User memory user = users[msg.sender];
        require(_amount <= user.allowance, "Allowance not sufficient!!");
        _;
    }

    // Coin instance is created while deploying the Wallet contract.
    constructor(Coin _coin) {
        coin = _coin;
    }

    // Only the owner can renew the allowance for a user, along with a validity.
    function renewAllowance(address _user, uint _allowance, uint _timeLimit) public onlyOwner {
        // Time limit is the range for which the user can spend. eg: 30 days
        // Validity is the time till when the user can spend. eg: today + 30 days i.e. today + time limit.
        uint validity = block.timestamp + _timeLimit;
        users[_user] = User(_user, _allowance, validity);
        emit AllowanceRenewed(_user, _allowance, _timeLimit);
    }

    // The user can spend coins till the allowance is met, and before the validity is over.
    // checkAllowance modifier will check the allowance limit.
    function spendCoins(address _receiver, uint _amount) public nonReentrant checkAllowance(_amount) {
        User storage user = users[msg.sender];
        // Current time should be before the validity is over.
        require(block.timestamp <= user.validity, "Validity expired!!");
        // Allowance is reduced before the coins are spent as a check against reentrancy attack.
        // Although we already have the nonReentrant modifier, but it's a good practice.
        user.allowance -= _amount;
        coin.transfer(_receiver, _amount);
        emit CoinsSpent(_receiver, _amount);
    }
}
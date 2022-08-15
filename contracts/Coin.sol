// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Importing openzeppelin contracts to create an ERC-20 token that is ownable, mintable and burnable.
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


// This contract will create a total of 10 Million coins.
// The owner can also mint or burn coins as per the requirement.
contract Coin is ERC20, ERC20Burnable, Ownable {

    // Event to be emitted whenever additional new coins are minted.
    event Minted(address indexed to, uint amount);

    // Minting 10 Million coins during deployment with 18 decimal points.
    constructor() ERC20("Coin", "COIN") {
        _mint(msg.sender, 10_000_000 * 10 ** decimals());
    }

    // To mint additional coins; only the owner can do it.
    function mint(address _to, uint _amount) public onlyOwner {
        _mint(_to, _amount);
        emit Minted(_to, _amount);
    }
}
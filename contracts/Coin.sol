// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Coin is ERC20, ERC20Burnable, Ownable {

    event Minted(address indexed to, uint amount);

    constructor() ERC20("Coin", "COIN") {
        _mint(msg.sender, 10_000_000 * 10 ** decimals());
    }

    function mint(address _to, uint _amount) public onlyOwner {
        _mint(_to, _amount);
        emit Minted(_to, _amount);
    }
}
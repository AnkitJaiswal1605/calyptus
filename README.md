# Calyptus Shared Wallet

This project demonstrates a shared wallet contract that can be used by an admin to provide allowances to users for a specic amount and a specific time duration.

# Components :

# Smart contracts 

1) Coin.sol - To create an ERC-20 token that can be spent by the users

etherscan link - https://rinkeby.etherscan.io/address/0x53ca7dfbA3a1a7ED8bA8F808e6e159B2503A1CF2

2) Wallet.sol - To store the coin supply, renew the user allowance by the owner, and spending of coins by the user

etherscan link - https://rinkeby.etherscan.io/address/0xebf8656Ccc7b0CA7AF57A02ACFeD6713549AbE19

Language - Solidity

Network - Rinkeby

Development framework - Hardhat

ethers.js for integration with frontend and script

mocha and chai for testing contracts

alchemy and infura as node providers

etherscan api for verifying smart contracts

# Frontend 

Development framework - React

Website link - 

Wallet - Metamask

# Backend scripts 

Written in ethers.js to interact with smart contract for renewing allowance and spending coins


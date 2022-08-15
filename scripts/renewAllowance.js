const { ethers } = require("ethers")

// Network details
const INFURA_ID = '222bc8dab3ce4f14b501b689ab71bd64'
const provider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${INFURA_ID}`)

const ownerPrivateKey = 'f67b1172673e582ca364ebec46f4a2fab097265f42781b7ec9cf7a59a940ff4f' // Private key of owner
const ownerWallet = new ethers.Wallet(ownerPrivateKey, provider)

// Transaction input details
const userAddress = '0x0D6089D678138745529De37753DbF672521198c9' // User address
const allowance = ethers.utils.parseEther("10000")
const timeLimit = 30*24*60*60

// Contract details
const ABI = [
    {
      "inputs": [
        {
          "internalType": "contract Coin",
          "name": "_coin",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timeLimit",
          "type": "uint256"
        }
      ],
      "name": "AllowanceRenewed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "CoinsSpent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "coin",
      "outputs": [
        {
          "internalType": "contract Coin",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_timeLimit",
          "type": "uint256"
        }
      ],
      "name": "renewAllowance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "spendCoins",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "users",
      "outputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "validity",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
const address = '0xebf8656Ccc7b0CA7AF57A02ACFeD6713549AbE19'
const contract = new ethers.Contract(address, ABI, provider)

// Transaction execution
const main = async () => {
    
    const contractWithWallet = contract.connect(ownerWallet)

    const tx = await contractWithWallet.renewAllowance(userAddress, allowance, timeLimit)
    await tx.wait()

    console.log(tx)

    const user = await contract.users(userAddress)
    const userAllowance = await user.allowance

    console.log(`\nRevised user allowance: ${userAllowance}`)
}

main()
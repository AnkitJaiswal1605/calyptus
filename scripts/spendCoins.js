const { ethers } = require("ethers")

// Network details
const INFURA_ID = '222bc8dab3ce4f14b501b689ab71bd64'
const provider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${INFURA_ID}`)

const spenderPrivateKey = 'b4d0bbb79da54c5456865fb84e98c8ab34f41c57983a01efb35bc8b05f163090' // Private key of spender
const spenderWallet = new ethers.Wallet(spenderPrivateKey, provider)

// Transaction input details
const spenderAddress = '0x0D6089D678138745529De37753DbF672521198c9' // Spender address
const receiverAddress = '0x6f213F3fffaBEb86B62a7995a5686D2BFaD29a3D' // Receiver address
const amount = ethers.utils.parseEther("2000")

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

    let spender = await contract.users(spenderAddress)
    const initialSpenderAllowance = await spender.allowance
    console.log(`Initial allowance: ${initialSpenderAllowance}\n`)
    
    const contractWithWallet = contract.connect(spenderWallet)

    const tx = await contractWithWallet.spendCoins(receiverAddress, amount)
    await tx.wait()

    console.log(tx)

    spender = await contract.users(spenderAddress)
    const finalSpenderAllowance = await spender.allowance
    console.log(`Final allowance: ${finalSpenderAllowance}\n`)
}

main()
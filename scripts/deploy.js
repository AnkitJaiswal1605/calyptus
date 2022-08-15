async function main() {
  
  // Getting the signers.
  const [deployer] = await ethers.getSigners();

  // Deploying Coin contract.
  console.log("Deploying Coin contract with the account:", deployer.address);

  const Coin = await ethers.getContractFactory("Coin");
  const coin = await Coin.deploy();

  console.log("Coin contract address:", coin.address);

  // Deploying Wallet contrsct.
  console.log("Deploying Wallet contract with the account:", deployer.address);

  const Wallet = await ethers.getContractFactory("Wallet");
  // Passing Coin contract address while deploying Wallet contract.
  const wallet = await Wallet.deploy(coin.address);

  console.log("Wallet contract address:", wallet.address);

  // Transferring the Coin total supply to Wallet smart contract.
  const totalSupply = await coin.totalSupply();
  await coin.transfer(wallet.address, totalSupply);

  console.log("Wallet balance updated!!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
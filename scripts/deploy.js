async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying Coin contract with the account:", deployer.address);

  const Coin = await ethers.getContractFactory("Coin");
  const coin = await Coin.deploy();

  console.log("Coin contract address:", coin.address);

  console.log("Deploying Wallet contract with the account:", deployer.address);

  const Wallet = await ethers.getContractFactory("Wallet");
  const wallet = await Wallet.deploy(coin.address);

  console.log("Wallet contract address:", wallet.address);

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
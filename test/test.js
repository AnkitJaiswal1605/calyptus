// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your tests. 
describe("Coin and Wallet contracts", function () {
  
  let Coin;
  let coin;
  let Wallet;
  let wallet;
  let owner;
  let addr1;
  let addr2;
  let totalSupply

  // `beforeEach` will run before each test, re-deploying the contract every time.
  beforeEach(async function () {
    
    // Get the ContractFactory and Signers here.
    Coin = await ethers.getContractFactory("Coin");
    Wallet = await ethers.getContractFactory("Wallet");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploying the contracts.
    coin = await Coin.deploy();
    wallet = await Wallet.deploy(coin.address);

    // Transferring the total supply from the owner to the Wallet smart contract.
    totalSupply = await coin.totalSupply();
    await coin.transfer(wallet.address, totalSupply);
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
   
    // `it` is another Mocha function you use to define your tests.
    it("Should set the right owner", async function () {
      
      // Expect receives a value, and wraps it in an Assertion object. 
      // This test expects the owner variable stored in the contract to be equal to our Signer's owner.
      expect(await coin.owner()).to.equal(owner.address);
      expect(await wallet.owner()).to.equal(owner.address);
    });

    // This test expects the total supply of COIN to be stored in the wallet smart contract on deployment.
    it("Should assign the total supply of coins to the wallet", async function () {
      const walletBalance = await coin.balanceOf(wallet.address);
      expect(await coin.totalSupply()).to.equal(walletBalance);
    });
  });

  describe("Transactions", function () {

    // This test expects the right allowance and validity to be set for the user once it's renewed by the owner
    it("Should set the right allowance for the user", async function () {
      
      // Renewing the allowance for addr1 and getting the timestamp.
      await wallet.renewAllowance(addr1.address, 5000, 200);
      const blockNum = await ethers.provider.getBlockNumber();
      const timestamp = (await ethers.provider.getBlock(blockNum)).timestamp;

      // Checking the user data from smart contract.
      const addr1User = await wallet.users(addr1.address);
      const addr1Allowance = await addr1User.allowance;
      const addr1Validity = await addr1User.validity;
      
      // Comparing the input values with actual values in smart contract.
      expect(addr1Allowance).to.equal(5000);
      expect(addr1Validity).to.equal(timestamp + 200);
    });

    // This test expects the spender to be able to spend coins, and balances and allowance to be updated after the transaction.
    it("User should be able to spend coins once approved, and balances should be updates", async function () {

      // Checking initial Wallet balance.
      const initialWalletBalance = await coin.balanceOf(wallet.address);

      // Allowance set to 5000 coins with a time limit of 200 seconds.
      await wallet.renewAllowance(addr1.address, 5000, 200);

      // Checking initial user allowance.
      let addr1User = await wallet.users(addr1.address);
      const initialAddr1Allowance = await addr1User.allowance;

      // Spending of coins by user
      await wallet.connect(addr1).spendCoins(addr2.address, 1000);

      // Checking final balances and allowance.
      const finalWalletBalance = await coin.balanceOf(wallet.address);
      addr1User = await wallet.users(addr1.address);
      const finalAddr1Allowance = await addr1User.allowance;
      const addr2Balance = await coin.balanceOf(addr2.address);

      // Comparing the final balances and allowance with the initial ones.
      expect(finalWalletBalance).to.equal(initialWalletBalance.sub(1000));
      expect(finalAddr1Allowance).to.equal(initialAddr1Allowance.sub(1000));
      expect(addr2Balance).to.equal(1000);
    });

    // This test expects the transaction to fail if the spender tries to spend more than the allowance.
    it("Should fail if spender doesn’t have enough allowance", async function () {

      // Allownace set to 5000 coins
      await wallet.renewAllowance(addr1.address, 5000, 200);

      let addr1User = await wallet.users(addr1.address);
      const initialAddr1Allowance = await addr1User.allowance;
      
      
      // Spender trying to spend 7000 coins; transaction should be reverted.
      await expect(
        wallet.connect(addr1).spendCoins(addr2.address, 7000)
      ).to.be.revertedWith("Allowance not sufficient!!");

      addr1User = await wallet.users(addr1.address);
      const finalAddr1Allowance = await addr1User.allowance;

      // Since the transaction failed, the final allowance should be same as the initial allowance.
      expect(await finalAddr1Allowance).to.equal(initialAddr1Allowance);
    });
  });
});
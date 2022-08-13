// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Coin and Wallet contracts", function () {
  // Mocha has four functions that let you hook into the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Coin;
  let coin;
  let Wallet;
  let wallet;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let totalSupply

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Coin = await ethers.getContractFactory("Coin");
    Wallet = await ethers.getContractFactory("Wallet");
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // To deploy our contract, we just have to call Coin.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    coin = await Coin.deploy();
    wallet = await Wallet.deploy(coin.address);

    totalSupply = await coin.totalSupply();
    await coin.transfer(wallet.address, totalSupply);
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await coin.owner()).to.equal(owner.address);
      expect(await wallet.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of coins to the wallet", async function () {
      const walletBalance = await coin.balanceOf(wallet.address);
      expect(await coin.totalSupply()).to.equal(walletBalance);
    });
  });

  describe("Transactions", function () {
    it("Should set the right allowance for the user", async function () {
      // Transfer 50 tokens from owner to addr1
      await wallet.renewAllowance(addr1.address, 5000);
      const addr1Allowance = await wallet.allowance(addr1.address);
      expect(addr1Allowance).to.equal(5000);
    });

    it("User should be able to spend coins once approved, and balances should be updates", async function () {
      const initialWalletBalance = await coin.balanceOf(wallet.address);

      await wallet.renewAllowance(addr1.address, 5000);
      const initialAddr1Allowance = await wallet.allowance(addr1.address);

      await wallet.connect(addr1).spendCoins(addr2.address, 1000);

      const finalWalletBalance = await coin.balanceOf(wallet.address);
      const addr1Allowance = await wallet.allowance(addr1.address);
      const addr2Balance = await coin.balanceOf(addr2.address);

      expect(finalWalletBalance).to.equal(initialWalletBalance.sub(1000));
      expect(addr1Allowance).to.equal(initialAddr1Allowance.sub(1000));
      expect(addr2Balance).to.equal(1000);
    });
  });
});
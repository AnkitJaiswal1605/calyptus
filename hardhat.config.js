require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");

const ALCHEMY_API_KEY = "WQjeQByhF_lB6qc520txknwEdgl-oqYs";

const RINKEBY_PRIVATE_KEY = "f67b1172673e582ca364ebec46f4a2fab097265f42781b7ec9cf7a59a940ff4f";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`],
      gasPrice: 100000000000,
    }
  },
  etherscan: {
    apiKey: "WRUK81WA2X1GGUX926UMSA2EZPQRWHIP8V"
  },
};

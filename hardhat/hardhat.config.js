require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const url = process.env.REACT_APP_HTTP_URL;
const pk = process.env.REACT_APP_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: url,
      accounts: [pk],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
};
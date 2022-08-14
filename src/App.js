import React, { useState, useEffect } from 'react'
import { ethers } from "ethers"
import Navbar from './components/Navbar';
import CoinAbi from './contractsData/CoinAbi.json'
import CoinAddress from './contractsData/CoinAddress.json'
import WalletAbi from './contractsData/WalletAbi.json'
import WalletAddress from './contractsData/WalletAddress.json'
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(true);
  const [account, setAccount] = useState(null);

  const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");
  const [logoutText, setLogoutText] = useState(null);

  const [coin, setCoin] = useState(null);
  const [wallet, setWallet] = useState(null);

  // MetaMask Login/Connect
  const login = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const { chainId } = await provider.getNetwork();
    if (chainId == 4) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0])
      const signer = provider.getSigner()
      loadContracts(signer);
      localStorage.setItem('loggedIn', true);
      setConnectButtonText("Connected");
      setLogoutText('Logout');
    } else {
      alert('Please connect to Rinkeby network');
    }
  }

  /************************************* On Page Load *******************************************/

  useEffect(() => {
    const onPageLoad = async () => {
        if (localStorage?.getItem('loggedIn')) {
            await login();
        }
     }
     onPageLoad();
   }, []);

/************************************* On Account Change *******************************************/

  window.ethereum.on('accountsChanged', async () => {
    document.location.reload()
  })

  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const coin = new ethers.Contract(CoinAddress.address, CoinAbi.abi, signer);
    setCoin(coin);
    const wallet = new ethers.Contract(WalletAddress.address, WalletAbi.abi, signer);
    setWallet(wallet);
    setLoading(false);
  }

  const logout = () => {  
    setCoin(null);
    setWallet(null);
    setAccount(null);
    localStorage.setItem('loggedIn', false);
    setConnectButtonText('Connect Wallet');
    setLogoutText(null);
  }

  const spendCoins = async (e) => {
    if(account) {
      e.preventDefault();
      const txResponse = await wallet.spendCoins(e.target.setText.value);
      setLoadingMsg('Processing...');
      await txResponse.wait();
      await getValue();
      eventListener();
      e.target.setText.value = null;
      setLoadingMsg(null);
      alert('Transaction completed!!');
    } else {
      alert('Please connect wallet!');
    }
  }

  const getValue = async () => {
    if (defaultAccount) {
        let val = await contract.get();
        setCurrentContractVal(val);
    } else {
        alert('Please connect wallet!');
    } 
  }

  return (
    <div className="App background">

      <Navbar 
        login={login} 
        logout = {logout} 
        account={account} 
        logoutText={logoutText}
        connectButtonText={connectButtonText}
      />

      <div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <p>Awaiting Metamask Connection...</p>
          </div>
        ) : (
          <div className="container">
            <h1>SHARED <span className="green-text">WALLET</span></h1>

            <h2>
                PENDING APPROVAL: <span className="green-text">{pendingApproval}</span>
            </h2>

            <form onSubmit={spendCoins} autoComplete="off">
                <input id='receiver' type='text' placeholder="Enter Receiver Address..." />
                <br />
                <input id='amount' type='number' placeholder="Enter Amount..." />
                <br />
                <button className="send-btn" type="submit">SEND</button>
                <h3 className="loading-msg">{loadingMsg}</h3>
            </form>
            <br />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
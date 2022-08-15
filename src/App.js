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
  const [pendingApprovalValue, setpendingApprovalValue] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);

  const ownerAddress = "0x54D2C951462A0B394b5FC620049C71BCE4976e59";
  const owner = ownerAddress.toLowerCase(); 

/************************************* Login and Logout *******************************************/ 

  const login = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();
    if (chainId == 4) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      const signer = provider.getSigner();
      loadContracts(signer);
      localStorage.setItem('loggedIn', true);
      pendingApproval();
      getWalletBalance();
      setConnectButtonText("Connected");
      setLogoutText('Logout');
    } else {
      alert('Please connect to Rinkeby network');
    }
  }

  const logout = () => {  
    setCoin(null);
    setWallet(null);
    setAccount(null);
    localStorage.setItem('loggedIn', false);
    setpendingApprovalValue(null);
    setWalletBalance(null);
    setConnectButtonText('Connect Wallet');
    setLogoutText(null);
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

/************************************* Load Contracts *******************************************/

  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const coin = new ethers.Contract(CoinAddress.address, CoinAbi.abi, signer);
    setCoin(coin);
    const wallet = new ethers.Contract(WalletAddress.address, WalletAbi.abi, signer);
    setWallet(wallet);
    setLoading(false);
  }

/************************************* Write Functions *******************************************/

  const spendCoins = async (e) => {
    if(account) {
      e.preventDefault();
      const txResponse = await wallet.spendCoins(e.target.receiver.value, ethers.utils.parseEther(e.target.amount.value));
      setLoadingMsg('Processing...');
      await txResponse.wait();
      await pendingApproval();
      e.target.receiver.value = null;
      e.target.amount.value = null;
      setLoadingMsg(null);
      alert('Transaction completed!!');
    } else {
      alert('Please connect wallet!');
    }
  }

  const renewAllowance = async (e) => {
    if(account) {
      e.preventDefault();
      const timeLimit = 30*24*60*60;
      const txResponse = await wallet.renewAllowance(e.target.user.value, ethers.utils.parseEther(e.target.allowance.value), timeLimit);
      setLoadingMsg('Processing...');
      await txResponse.wait();
      e.target.user.value = null;
      e.target.allowance.value = null;
      setLoadingMsg(null);
      alert('Allowance renewed!!');
    } else {
      alert('Please connect wallet!');
    }
  }

/************************************* Read Functions *******************************************/
 
  const pendingApproval = async () => {
    if(account) {
      let user = await wallet.users(account);
      let val = await user.allowance;
      setpendingApprovalValue(val);
    } 
  }

  const getWalletBalance = async () => {
    if(account) {
      let bal = await coin.balanceOf(WalletAddress.address);
      setWalletBalance(bal);
      return bal;
    } 
  }

/************************************* App Component *******************************************/

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
        ) : ((account == owner) ? (
          <div className="container">
            <h1>ADMIN <span className="green-text">DASHBOARD</span></h1>

            <h2 className='pending-approval'>
              WALLET BALANCE: <span className="green-text">{walletBalance && walletBalance/10**18}</span>
              {!walletBalance ?
              <button className="get-btn" onClick={getWalletBalance}>CHECK</button> :
              <button className="get-btn" onClick={() => setWalletBalance(null)}>CLEAR</button>}
            </h2>

            <form onSubmit={renewAllowance} autoComplete="off">
              <input id='user' className='input' type='text' placeholder="Enter User Address..." />
              <br />
              <input id='allowance' className='input' type='number' min="1" step="1" placeholder="Enter Allowance..." />
              <br />
              <button className="send-btn" type="submit">SET</button>
            </form>

            <h3 className="loading-msg">{loadingMsg}</h3>
            <br />
          </div>
         ) : (
          <div className="container">
            <h1>SHARED <span className="green-text">WALLET</span></h1>

            <h2 className='pending-approval'>
              PENDING ALLOWANCE: <span className="green-text">{pendingApprovalValue && pendingApprovalValue/1000000000000000000}</span>
              {!pendingApprovalValue ?
              <button className="get-btn" onClick={pendingApproval}>CHECK</button> :
              <button className="get-btn" onClick={() => setpendingApprovalValue(null)}>CLEAR</button>}
            </h2>

            <form onSubmit={spendCoins} autoComplete="off">
              <input id='receiver' className='input' type='text' placeholder="Enter Receiver Address..." />
              <br />
              <input id='amount' className='input' type='number' min="1" step="1" placeholder="Enter Amount..." />
              <br />
              <button className="send-btn" type="submit">SEND</button>
            </form>

            <h3 className="loading-msg">{loadingMsg}</h3>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
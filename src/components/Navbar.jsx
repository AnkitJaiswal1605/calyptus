const Navbar = ({ login, logout, account, logoutText, connectButtonText }) => {
    
    const walletStyle = {color: "#4dfed4", borderColor: "#4dfed4"};

    return (

        <div className="navbar">
            <div className="logo">CALYPTUS</div>
        
            <div className="connection-div">
                <p className="logout" onClick={logout}>{logoutText}</p>
                <div className="wallet-div">
                    <button 
                        className="wallet-btn" 
                        style={account && walletStyle} 
                        onClick={login}>
                        {connectButtonText}
                    </button>
                    <p>{account ? account.substring(0,5) + "..." + account.substring(account.length - 5) : "Network : Rinkeby"}</p>
                </div>
            </div>
        </div>
    )

}

export default Navbar;
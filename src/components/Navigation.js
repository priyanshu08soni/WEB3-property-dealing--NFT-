import logo from '../assets/logo.svg';

const Navigation = ({ account, setAccount }) => {
    const connectHandler = async ()=>{
        //connect to metamask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
        setAccount(accounts[0]);
    }
    return(
        <nav>
            <div className="nav__brand">
                <img src={logo} alt="logo" />
                <h1>Properties.</h1>
            </div>
            {
                account ? (
                    <button
                        type='button'
                        className='nav__connect'
                    >
                        {account.slice(0,6) + '...' + account.slice(38,42)}
                    </button>
                ) : (
                    <button
                        type='button'
                        className='nav__connect'
                        onClick={connectHandler}
                    >Connect</button>
                )
            }
        </nav>
    )
}

export default Navigation;

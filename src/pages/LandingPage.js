import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "../components/Navigation";
import Search from "../components/Search";
import Home from "../components/Home";

// ABIs
import RealEstate from "../abis/RealEstate.json";
import Escrow from "../abis/Escrow.json";

// Config
import config from "../config.json";
import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";

const LandingPage =()=> {
  const [account, setAccount] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [provider, setProvider] = useState(null);
  const [homes, setHomes] = useState([]);
  const [home, setHome] = useState({});
  const [toggle, setToggle] = useState(false);
  const loadBlockchainData = async () => {
    // window.ethereum provides ethereum blockchain that is deployed in our localhost.
    // and then we use ethers library to connect to that blockchain.
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    const realEstate = new ethers.Contract(
      config[network.chainId].realEstate.address,
      RealEstate,
      provider
    );
    const totalSupply = await realEstate.totalSupply();
    const homes = [];

    for (var i = 1; i <= totalSupply; i++) {
      const uri = await realEstate.tokenURI(i);
      const response = await fetch(uri);
      const metadata = await response.json();
      homes.push(metadata);
    }
    setHomes(homes);

    const escrow = new ethers.Contract(
      config[network.chainId].escrow.address,
      Escrow,
      provider
    );
    setEscrow(escrow);

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
    console.log(homes);
  }, []);

  const togglePop = (home) => {
    setHome(home);
    toggle ? setToggle(false) : setToggle(true);
  };

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search />
      <div className="cards__section">
        <h3>Homes For You</h3>
        <div className="cards">
          {homes &&
            homes?.map((home, index) => {
              return (
                <div
                  className="card"
                  key={index}
                  onClick={() => {
                    togglePop(home);
                  }}
                >
                  <div className="card__image">
                    <img src={home?.image} alt="Home" />
                  </div>
                  <div className="card__info">
                    <h4>{home?.attributes[0]?.value} ETH</h4>
                    <p>
                      <strong>{home?.attributes[2]?.value}</strong>bds |
                      <strong>{home?.attributes[3]?.value}</strong>ba |
                      <strong>{home?.attributes[4]?.value}</strong>sqft
                    </p>
                    <p>{home?.address}</p>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="button_home">
            <NavLink to="/properties" className="homes_button" >Search More Properties...</NavLink>
        </div>
      </div>
      {toggle && (
        <Home
          home={home}
          provider={provider}
          account={account}
          escrow={escrow}
          togglePop={togglePop}
        />
      )}
      <Footer/>
    </div>
  );
}

export default LandingPage;
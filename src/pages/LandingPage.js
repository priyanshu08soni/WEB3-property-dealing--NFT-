import { useEffect, useState } from "react";
import { ethers } from "ethers";
import logo from "../assets/logo.svg";
import city from "../assets/houses.png"
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

const LandingPage = () => {
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
        <div>
          <div className="nav__brand">
            <img src={logo} alt="logo" />
            <h1>Properties.</h1>
          </div>
          <div className="estate_description">
            <p>Our real estate website offers a </p>
            <p>
              seamless and modern way to purchase premium properties using
              Ether, the cryptocurrency of the Ethereum network. With a
              selection of high-quality properties boasting
            </p>
            <p>stunning views, we provide a unique </p>
            <p>
              and efficient payment process, making your real estate investment
              both secure and futuristic.
            </p>
          </div>
        </div>
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
          <NavLink to="/properties" className="homes_button">
            Search More Properties...
          </NavLink>
        </div>
      </div>
      <h3 className="about_home_head">About us</h3>
      <div className="about_description_home">Our commitment to excellence and innovation is reflected in our adoption of blockchain technology for secure transactions using ethers, making property ownership seamless and transparent.</div>
      <div className="about_section_home">
        <div class="card-container">
          <div class="card_about card1">
            <p>Welcome to Properties., where we turn your dream of owning a property with breathtaking views into reality. With years of experience in the real estate industry, we have successfully delivered numerous projects that have brought satisfaction to homeowners across various locations.</p>
          </div>
          <div class="card_about card2">
            <p>Let us help you find your next property with a view that inspires.</p>
            <NavLink to="/about" className="about_button">
                Let Us Help You.
            </NavLink>
          </div>
          <div class="card_about card3">
            <p>Over the years, we have earned the trust of our clients through dedication and a customer-first approach, ensuring that every project meets the highest standards of quality. Our portfolio includes a diverse range of properties, from luxurious villas to modern apartments, all designed to offer stunning views and exceptional living experiences.</p>
          </div>
        </div>
      </div>
      <section className="climbing">
        <div className="climb_view">
          <img
            src={city}
            alt="realestateview"
          />
          <div className="view_des">
            <h1>Whatever the trade</h1>
            <h2>Analyse it</h2>
            <h2>Then leap.</h2>
          </div>
        </div>
      </section>
      {toggle && (
        <Home
          home={home}
          provider={provider}
          account={account}
          escrow={escrow}
          togglePop={togglePop}
        />
      )}
      <Footer />
    </div>
  );
};

export default LandingPage;

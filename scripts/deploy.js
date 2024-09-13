// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}
async function main() {
  [buyer, seller, inspector, lender] = await ethers.getSigners();

  //Deploy Real Estate
  const RealEstate = await ethers.getContractFactory("RealEstate");
  const realEstate = await RealEstate.deploy();
  await realEstate.deployed();

  console.log(`Deployed Real Estate Contract at : ${realEstate.address}`);
  
  console.log(`Minting 1 properties...\n`);
  for (let i = 0; i < 1; i++) {
    const transaction = await realEstate
    .connect(seller)
    .mint(
      `https://coffee-hilarious-crayfish-594.mypinata.cloud/ipfs/QmZyNvqhQdFDJ1nsoeW5QPWBP9YmsQgqkpnQ3ZbAjpgz4s/${
          i + 1
        }.json`
        );
        await transaction.wait();
      }
      
      const Escrow = await ethers.getContractFactory("Escrow");
      const escrow = await Escrow.deploy(
        realEstate.address,
        seller.address,
        inspector.address,
        lender.address
        );
  await escrow.deployed();
 
  console.log(`Deployed Escrow Contract at : ${escrow.address}`);
  
  for (let i = 0; i < 1; i++) {
    let transaction = await realEstate.connect(seller).approve(escrow.address,i+1);
    await transaction.wait();
    
  }

  //List Properties 
  transaction = await escrow.connect(seller).list(1,buyer.address,tokens(10),tokens(5));
  await transaction.wait();
  console.log('Finished.')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

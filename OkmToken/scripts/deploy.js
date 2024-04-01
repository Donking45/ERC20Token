const hardhat = require("hardhat")

async function main(){ 
    const OkmToken = await hardhat.ethers.getContractFactory("OkmToken"); // fetching bytecode and ABI
    const OkmTokenContract = await OkmToken.deploy({ gasLimit: 2000000 }); // creating an instance of the smart contract
    
    await OkmTokenContract.getDeployedCode(); // Deploying the smart contract
    
    console.log("Deployed contract address:", `${OkmTokenContract.target}`);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });

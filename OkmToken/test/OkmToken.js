const { expect } = require("chai");
const hre = require("hardhat");

describe("OkmToken contract", function() {
    let Token;
    let OkmToken;
    let admin;
    let addr1;
    let addr2;
    let tokenCap = 100000000;

    
    beforeEach(async function () {
        this.timeout(60000);
        Token = await ethers.getContractFactory("OkmToken");
        [admin, addr1, addr2] = await hre.ethers.getSigners();
        OkmToken = await Token.deploy(); // Deploying the smart contract
    }); 
    
    describe("Deployment", function () {
        it("should set the right admin", async function () {
            expect(await OkmToken.admin()).to.equal(admin.address);
        });
    
        it("should assign the total supply of tokens to the admin", async function () {
            const adminBalance = await OkmToken.balanceOf(admin.address);
            expect(await OkmToken.totalSupply()).to.equal(adminBalance);
        });
    
        it("should set the max capped supply to the argument provided during deployment", async function () {
            const cap  = await OkmToken.cap();
            expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            await OkmToken.transfer(addr1.address, 50);
            const addr1Balance = await OkmToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);

            await OkmToken.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await OkmToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await OkmToken.balanceOf(admin.address);
            await expect(
                OkmToken.connect(addr1).transfer(admin.address, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

            expect(await OkmToken.balanceOf(admin.address)).to.equal(initialOwnerBalance);
        });

        it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await OkmToken.balanceOf(admin.address);
            await OkmToken.transfer(addr1.address, 100);
            await OkmToken.transfer(addr2.address, 50);

            const finalOwnerBalance = await OkmToken.balanceOf(admin.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

            const addr1Balance = await OkmToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);

            const addr2Balance = await OkmToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });
    });   
});


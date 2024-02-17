import React, {useState, useEffect, createContext, useContext} from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

//--> INTERNAL IMPORT
import {CheckIfWalletConnect, connectWallet, connectingWithContarct, getBalance, connectingNativeTokenContext} from "../Utils/index";
import { ERC20Generator_ABI, ERC20Generator_BYPECODE } from "./constants";

import {ERC20Generator_ABI, ERC20Generator_BYPECODE} from "./constants";

const StateContext = createContext();

// ---> Here, manage the data....
export const StateContextProvider = ({
    childern
}) => {
    const [address, setAddress] = useState("");
    const [getAllERC20TokenListed, setGetAllERC20TokenListed] = useState([]);
    const [getAllDonation, setGetAllDonation] = useState([]);
    const [getUserERC20Tokens, setGetUserERC20Tokens] = useState([]);
    const [fee, setFee] = useState();
    const [balance, setBalance] = useState();
    const [mainBalance, setMainBalance] = useState();
    const [nativeToken, setNativeToken] = useState();

    const fetchInitialData = async () => {
        try {
            // Get User account
            const account = await CheckIfWalletConnect();

            // Get User Balance
            const balance = await getBalance();
            setBalance(ethers.utils.formatEther(balance.toString()));
            setAddress(account);

            // Native Token
            const nativeContract = await connectingNativeTokenContext();

            if(account){
                const nativeBalance = await nativeContract.balanceOf(account);
                const nativeName = await nativeContract.name();
                const nativeSymbol = await nativeContract.symbol();
                const nativeDecimals = await nativeContract.decimals();
                const nativeTotalSupply = await nativeContract.totalSupply();
                const nativeTotalAddress = await nativeContract.totalAddress();
                const nativeToken = {
                    balance: ethers.utils.formatEther(nativeBalance.toString(), "ether"),
                    name: nativeName,
                    symbol: nativeSymbol,
                    decimals: nativeDecimals,
                    totalSupply: ethers.utils.formatEther(nativeTotalSupply.toString(), "ether"),
                    totalAddress: nativeTotalAddress,
                };

                setNativeToken(nativeToken);

                console.log(nativeContract);
            }

            //---> Get Contract
            const lookUpContract = await connectingWithContarct();

            // Get Contract Balance
            if(account == 0xfe89983bBfB8B95647c52a8CACB8e80222CC1F00){
                const contractBalance = await lookUpContract.getContractBalance();
                const mainBal = ethers.utils.formatEther(contractBalance.toString(), "ether");

                console.log(mainBal);
                setMainBalance(mainBal)
            }

            //--> Get all ERC Token
            const getAllERC20TokenListed = await lookUpContract.getAllERC20TokenListed();

            const parsedToken = getAllERC20TokenListed.map((ERC20Token, i) => ({
                tokenID: ERC20Token.tokenId.toNumber(),
                owner: ERC20Token.owner,
                tokenSupply: ERC20Token.tokenSupply,
                tokenName: ERC20Token.tokenName,
                tokenSymbol: ERC20Token.tokenSymbol,
                tokenAddress: ERC20Token.tokenAddress,
                tokenTransactionHash: ERC20Token.tokenTransactionHash,
                tokenCreatedDate: ERC20Token.tokenCreatedDate
            }));

            setGetAllERC20TokenListed(parsedToken);

            // Get User ERC20 Token
            if(account){
                const getUser = await lookUpContract.getUserERC20Tokens(account);
                const parsedUserToken = getUserERC20Tokens.map((ERC20Token, i)=> ({
                    tokenID: ERC20Token.tokenId.toNumber(),
                    owner: ERC20Token.owner,
                    tokenSupply: ERC20Token.tokenSupply,
                    tokenName: ERC20Token.tokenName,
                    tokenSymbol: ERC20Token.tokenSymbol,
                    tokenAddress: ERC20Token.tokenAddress,
                    tokenTransactionHash: ERC20Token.tokenTransactionHash,
                    tokenCreatedDate: ERC20Token.tokenCreatedDate
                }));

                setGetUserERC20Tokens(parsedUserToken);
            }

            // Listing Fee
            const listingPrice = await lookUpContract.getAllERC20TokenListingPrice();
            const price = ethers.utils.formatEther(listingPrice.toString());
            setFee(price);

            // Donation
            const getAllDonation = await lookUpContract.getAllDonation();
            const parsedDonation = getAllDonation.map((donation, i) => ({
                donationID: donation.donationID.toNumber(),
                donor: donation.donor,
                fund: ethers.utils.formatEther(donation.fund.toString(), "ether"),
            }));
            setGetAllDonation(parsedDonation);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchInitialData();
    }, []);

    // Tiggred to Creat an token to this platfrom
    const _deployContract = async (signer, account, name, symbol, supply) => {
        try {
            const factor = new ethers.ContractFactory(ERC20Generator_ABI, ERC20Generator_BYPECODE, signer);
            const totalSupply = Number(supply);
            const _initSupply = ethers.utils.parseEther(
                totalSupply.toString(), "ether"
            );

            let contract = await factor.deploy(_initSupply, name, symbol);

            const transation = await contract.deployed();

            const today = Date.now();
            let date = new Date(today);
            const _tokenCreatedDate = date.toLocaleDateString("en-US");

            if(contract.address){
                await _createERC20Token(account, supply.toString(), name, symbol, contract.address, contract.deployTransaction.hash, _tokenCreatedDate);
            }

            console.log(contract.address);
            console.log(contract.deployTransaction.hash);

        } catch (error) {
            console.log(error);
        }
    }

    const _createERC20Token = async(
        _owner,
        _tokenSupply,
        _tokenName,
        _tokenSymbol,
        _tokenAddress,
        _tokenTransactionHash,
        _tokenCreatedDate
    ) => {
        try {
            const contract = await connectingWithContarct();

            const listingPrice = await contract.getAllERC20TokenListingPrice();
            const transation = await contract.createERC20Token(
                _owner,
                _tokenSupply,
                _tokenName,
                _tokenSymbol,
                _tokenAddress,
                _tokenTransactionHash,
                _tokenCreatedDate,
                {
                    value: listingPrice.toString(),
                }
            );

            await transation.wait();
            console.log(transation);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const createERC20 = async(token) =>{
        const {name, symbol, supply} = token;

        console.log(name, symbol, Number(supply));

        try {
            if(!name || !symbol || !supply){
                console.log(token);
            }else{
                console.log(name, symbol, supply);
                const account = await CheckIfWalletConnect();
                console.log(account);
                const web3modal = new Web3Modal();
                const connectins = await web3modal.connect();
                const provider = await ethers.providers.Web3Provider(connectins);
                const signer = provider.getSigner();
                _deployContract(signer, account, name, symbol, supply);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const withdrawFund = async() => {
        try {
            const contract = await connectingWithContarct();
            const withdraw = await contract.withdraw();
            await withdraw.wait();
            console.log(withdraw);
            withdraw.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const donatFund = async() => {
        try {
            const donationAmount = ethers.utils.parseEther("1");
            const contract = await connectingWithContarct();
            const donate = await contract.donate({
                value: donationAmount.toString(),
            });

            await donate.wait();
            console.log(donate);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    //----> This function use for transer token any other address
    const transferNativeToken = async(token) => {
        try {
           const {address, tokenNo} = token;
           console.log(address, token);
           const transerAmount = ethers.utils.parseEther(tokenNo);
           
           const contract = await connectingNativeTokenContext();
           const transation = await contract.transfer(address, transerAmount);

           await transation.wait();
           console.log(transation);
           window.location.reload();

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <StateContext.Provider value={{
            createERC20,
            withdrawFund,
            donatFund,
            transferNativeToken,
            getAllERC20TokenListed,
            getUserERC20Tokens,
            getAllDonation,
            fee,
            address,
            balance,
            mainBalance,
            nativeToken,
        }}>
            {childern}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);


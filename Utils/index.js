import { ethers } from "ethers";
import Web3Modal from "web3modal";

import {LookUpContract_ABI, LookUpContract_ADDRESS, ERC20Generator_ADDRESS,ERC20Generator_ABI} from "../Context/constants";

export const CheckIfWalletConnect = async() => {
    try {
        if(!window.ethereum) return console.log("Install Metamask...");

        const account = window.ethereum.request({
            method: "eth_accounts",
        });

        const firstAccount = account[0];
        return firstAccount;
    } catch (error) {
        console.log(error);
    }
}

export const connectWallet = async() => {
    try {
        if(!window.ethereum) return console.log("Install Metamask...");
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        const firstAccount = accounts[0];
        return firstAccount;
    } catch (error) {
        console.log(error);
    }
}

const fetchContarct = (sigerOrProvider) => new ethers.Contract(LookUpContract_ADDRESS, LookUpContract_ABI,sigerOrProvider);

export const connectingWithContarct = async() => {
    try {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const Contract = fetchContarct(signer);
        
        return Contract;

    } catch (error) {
        console.log(error);
    }
};

export const getBalance = async() => {
    try {
        const web3modal = new Web3Modal();
        const connection = web3modal.connect();
        const provider = new ethers.Web3Provider(connection);

        return await signer.getBalance();

    } catch (error) {
        console.log(error);
    }
};

const fetchTokenContract = (sigerOrProvider) => new ethers.Contract(ERC20Generator_ADDRESS,ERC20Generator_ABI, sigerOrProvider);

export const connectingNativeTokenContext = async() => {
    try {
        const web3modal = new Web3Modal();
        const connection = web3modal.connect();
        const provider = new ethers.Web3Modal(connection);
        const signer = provider.getSigner();
        const Contract = fetchTokenContract(signer);

        return Contract;

    } catch (error) {
        console.log(error);
    }
};



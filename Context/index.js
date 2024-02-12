import React, {useState, useEffect, createContext, useContext} from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

//--> INTERNAL IMPORT
import {CheckIfWalletConnect, connectWallet, connectingWithContarct, getBalance, connectingNativeTokenContext} from "../Utils/index";
import { ERC20Generator_ABI, ERC20Generator_BYPECODE } from "./constants";

import {ERC20Generator_ABI, ERC20Generator_BYPECODE} from "./constants";

const StateContext = createContext();

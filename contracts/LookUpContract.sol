// All tranfer here play...

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract LookUpContract{

    // this struct using the this all infromation show on UI(UserScreen)
    struct ERC20Token{
        uint256 tokenID;
        address owner;
        string tokenSupply;
        string tokenName;
        string tokenSymbol;
        string tokenAddress;
        string tokenTransactionHash;
        string tokenCreateDate;
    }

    // this struct use to donation crypto
    struct Donation{
        uint256 donationID;
        address donor;
        uint256 fund;
    }

    // get the balance of the contract
    address payable contractOwner = payable(0xfe89983bBfB8B95647c52a8CACB8e80222CC1F00);

    uint256 public listingPrice = 0.025 ether;
    mapping(uint256 => ERC20Token) private erc20Tokens;
    mapping(uint256 => Donation) private donation;

    uint256 public _tokenIndex; // user add toke nthen this value increments
    uint256 public _donationIndex; // User donated they increments

    event DoantionReceived(address indexed donor, uint256 amout);
    event ERC20TokenList(uint256 indexed id, address indexed owner, string indexed token);


    modifier onlyOwner(){
        require(msg.sender == contractOwner, "This Function use for only Owner");
        _;
    }

    function createERC20Token(address _owner, string memory _tokenSupply, string memory _tokenName, string memory _tokenSymbol,
        string memory _tokenAddress, string memory _tokenTransactionHash, string memory _tokenCreateDate
    ) payable external returns(uint256,address,string memory, string memory, string memory, string memory){
        _tokenIndex++;
        uint256 _tokenId = _tokenIndex;
        ERC20Token storage erc20Tokens = erc20Tokens[_tokenId];

        // Update the Data(Information)
        erc20Tokens.tokenID = _tokenId;
        erc20Tokens.owner = _owner;
        erc20Tokens.tokenSupply = _tokenSupply;
        erc20Tokens.tokenName = _tokenName;
        erc20Tokens.tokenSymbol = _tokenSymbol;
        erc20Tokens.tokenAddress = _tokenAddress;
        erc20Tokens.tokenTransactionHash = _tokenTransactionHash;
        erc20Tokens.tokenCreateDate = _tokenCreateDate;

        emit ERC20TokenList(_tokenId, _owner, _tokenAddress);

        return (_tokenId, _owner, _tokenAddress, _tokenName, _tokenSymbol, _tokenAddress);

    }

    function getAllERC20TokenListed() public view returns(ERC20Token[] memory){
        uint256 itemCount = _tokenIndex;
        uint256 currentIndex = 0;

        ERC20Token[] memory items = new ERC20Token[](itemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            uint256 currentId = i + 1;
            ERC20Token storage currentItem = erc20Tokens[currentId];
            items[currentIndex] = currentItem;
            currentIndex+=1;

        }
        return items;
    }

    function getERC20Token(uint256 _tokenID) external view returns(uint256, address, string memory, string memory,
        string memory, string memory, string memory, string memory
    )
    {
        // here, give an information of passed token.
        ERC20Token memory erc20Tokens = erc20Tokens[_tokenID];

        return (
            erc20Tokens.tokenID,
            erc20Tokens.owner,
            erc20Tokens.tokenSupply,
            erc20Tokens.tokenName,
            erc20Tokens.tokenSymbol,
            erc20Tokens.tokenAddress,
            erc20Tokens.tokenTransactionHash,
            erc20Tokens.tokenCreateDate,
        );
    }

    function getUserERC20Tokens(address _user)external view returns(ERC20Token[] memory){
        uint256 totalItemCount = _tokenIndex;
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < itemCount; i++) {
            if(erc20Tokens=[i+1].owner == _user){
                itemCount += 1;
            }
        }

        ERC20Token[] memory items = new ERC20Token[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if(erc20Tokens[i+1].owner == _user){
                uint256 currentId = i+1;
                ERC20Token storage currentItem = erc20Tokens[currentId];
                items[currentIndex] = currentIndex;
                currentIndex += 1;
            }
        }
        return items;
    }

    function getERC20TokenListingPrice() public view returns(uint256){
        return listingPrice;
    }

    // Update listing data
    function updateListingPrice(uint256 _listingPrice, address owner) public payable onlyOwner{
        require(contractOwner == owner, "Only contract update listing data...");
        listingPrice = _listingPrice;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No donation available for withdraw");
        payable(contractOwner).tranfer(balance);
    }

    function getContractBalance() external view onlyOwner returns(uint256) {
        uint256 balance = address(this).balance;
        return balance;
    }

    function donate()external payable {
        require(msg.value > 0, "Donation value must be greater then 0");
        _donationIndex++;
        uint256 _donationId = _donationIndex;
        Donation storage donation = donation[_donationId];
        donation.donationID = _donationId;
        donation.donor = msg.sender;
        donation.fund = msg.value;


        emit DoantionReceived(msg.sender, msg.value);
    }

    function getAllDonation() public view returns(Donation[] memory){
        uint256 itemCount = _donationIndex;
        uint256 currentIndex = 0;

        Donation[] memory items = new Donation[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            uint256 currentId = i + 1;
            Donation storage currentItem = donation[currentId];
            items[currentIndex] = currentItem;
            currentIndex+=1;
        }

        return items;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; 
//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract LotteryEscrow is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint256 public feePercent = 2; //the fee percntage on sales
    // address payable public feeAccount;
    mapping(uint256 => address payable) public OwnerOfAnNFT;
    address payable public winner;

    
    struct MarketItem {
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event MarketItemCreated(
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );
    event Bought(
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );
    mapping(uint256 => MarketItem) public marketItems;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol)
    {}

    function safeMint(address payable to, uint256 price) public returns (uint256) {
        require(to != address(0), "The recipient address must not be zero");
        
        uint256 tokenId = _tokenIdCounter.current();
        require(OwnerOfAnNFT[tokenId] == address(0), "The tokenId is already taken");
        // Store the owner of the tokenId or NFT
        OwnerOfAnNFT[tokenId] = to;
         _safeMint(to, tokenId);
        marketItems[tokenId] = MarketItem(
            address(this),
            tokenId,
            payable(to),
            payable(address(0)),
            price,
            false
        );
        _tokenIdCounter.increment();
        emit MarketItemCreated(address(this), tokenId, to, address(0), price);

        return tokenId;
    }
    function setTokenURIs(uint256 tokenIDs,string memory tokenURIs) public {
        //for (uint256 i = 0; i < tokenIDs.length; i++) {
          _setTokenURI(tokenIDs,tokenURIs);
        //} 
    }
    //Function to select a tokenID randomely
    function selectRandomTokenId() public view returns (uint256) {
        uint256[] memory allTokenIds;
        uint256 count = 0;
        for (uint256 tokenId = 0; tokenId < 100000; tokenId++) { // for demonstration purposes
            if (OwnerOfAnNFT[tokenId] != address(0)) {
                allTokenIds[count] = tokenId;
                count++;
            }
        }
        return allTokenIds[uint256(keccak256(abi.encodePacked(block.timestamp))) % count];
    }

    function playLottery() public {
        uint256 randomTokenId = selectRandomTokenId();
        winner = OwnerOfAnNFT[randomTokenId];
        winner.transfer(address(this).balance);

    }

    function transferTokens(
        address from,
        address payable to,
        address token,
        uint256 amount
    ) public {
        if (token != address(0)) {
            IERC721(token).transferFrom(from, to, amount);
        } else {
            require(to.send(amount), "Transfer of ETH to receiver failed");
        }
    }

    function purchaseItem(uint256 tokenId, address to) external payable {
        uint256 _totalPrice = getTotalPrice(tokenId);
        MarketItem memory item = marketItems[tokenId];
        require(
            msg.value >= _totalPrice,
            "not enough matic to cover item price and market fee"
        );
        require(!item.sold, "item already sold");

        item.seller.transfer(item.price);
        item.sold = true;
        IERC721(item.nftContract).transferFrom(item.seller, to, tokenId);
        marketItems[tokenId].owner = payable(to);

        emit Bought(address(this), item.tokenId, item.price, item.seller, to);
        
    } 
 
   
       
   
    function getTotalPrice(uint256 tokenId) public view returns (uint256) {
        return ((marketItems[tokenId].price * (100 + feePercent)) / 100);
    }   
}


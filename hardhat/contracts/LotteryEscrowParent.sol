// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LotteryEscrow.sol";
   
 contract LotteryEscrowParent is Ownable{

    event TokenCreated(address, address);
    event TokenTransfered(address, address, address, uint256);
    uint getNFTCount;
    uint getAddressCount;
    mapping(address => address[]) private tokens;
    // mapping(address => uint256[]) counts;
    mapping (address => uint256[] ) contractTokenIds;
    mapping (address => string) collections;

    function createToken(string memory name, string memory symbol, uint256 start, uint256 end) public {
        address _address = address(new LotteryEscrow(name, symbol));
       uint256 count = 0;
       tokens[msg.sender].push(_address);
       count++;       
        emit TokenCreated(msg.sender, _address);
    }

    function setCollectionUri(address collectionContract, string memory uri) public{
            collections[collectionContract] = uri;
    }

    function getCollectionUri(address collectionContract) public view returns(string memory){
       return collections[collectionContract];
    }
    
    function bulkMintERC721(
        address payable mintor,
        address payable tokenAddress,
        uint256 start,
        uint256 end,
        uint256 price
    ) public {
         uint256 count = 0;
        for (uint256 i = start; i < end; i++) {
         uint256 tokenId =  LotteryEscrow(tokenAddress).safeMint(mintor , price);
        contractTokenIds[tokenAddress].push(tokenId);
                          count++;             
            }         
        getNFTCount = count;
   } 
  
function getContractAddresses() public view returns(address[] memory) {
  return tokens[msg.sender];
}


function getAllTokenId(address tokenContractAddress) public view returns (uint[] memory){
    uint[] memory ret = new uint[](getNFTCount);
    for (uint i = 0; i < getNFTCount; i++) {
        ret[i] = contractTokenIds[tokenContractAddress][i];
    } 
    return ret;
}

      function callPurchaseItem(
         uint256 tokenId,
         address tokenAddress
      )public payable{
LotteryEscrow(tokenAddress).purchaseItem(tokenId,msg.sender);
      }

    function transferToken(
        address from,
        address payable to,
        address  token,
        uint256 amount
    ) public {
        LotteryEscrow(token).transferTokens(from, to, token, amount);
        emit TokenTransfered(from, to, token, amount);
    }
       
}


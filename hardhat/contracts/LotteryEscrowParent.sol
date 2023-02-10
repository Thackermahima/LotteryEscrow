// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
//import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./LotteryEscrow.sol";
   
 contract LotteryEscrowParent is Ownable{

    event TokenCreated(address, address);
    event TokenTransfered(address, address, address, uint256);
  uint getNFTCount;
    //mapping(address=>string) tokenNames;
    //mapping(address => address[]) tokens;
   // mapping(address => uint256[]) public tokenIds;


    mapping (address => uint256[] ) contractTokenIds;
    // mapping (uint256 => string) public tokenURIs;

    //address[] tokenContracts;    
    function createToken(string memory name, string memory symbol) public {
        address _address = address(new LotteryEscrow(name, symbol)); // Created Token contract.
         //tokenNames[_address] = name;
         //tokens[msg.sender].push(_address);
        emit TokenCreated(msg.sender, _address);
    } 
    
    function bulkMintERC721(
        address payable mintor,
        address payable tokenAddress,
        uint256 start,
        uint256 end,
        uint256 price
        // string[] memory _tokenURIs
    ) public {
         uint256 count = 0;
        for (uint256 i = start; i < end; i++) {
         // uint256 tokenId =  LotteryEscrow(tokenAddress).safeMint(mintor , price, _tokenURIs[i])
         uint256 tokenId =  LotteryEscrow(tokenAddress).safeMint(mintor , price);

        contractTokenIds[tokenAddress].push(tokenId);
                          count++;
                      
            } 
        //setTokenId(end - 1, tokenAddress);
        
        getNFTCount = count;
   } 
//   function setTokenURI(uint256[] memory tokenIds, string[] memory tokenURI) public {
//     tokenURIs[tokenIds] = tokenURI; 
//   }
//   function getTokenURI(uint256[] memory tokenId) public view returns(string memory){
//     return tokenURIs[tokenId];
//   }
   function BulkSetTokenURI(address tokenContractAddress, uint256[] memory tokenIDs, string[] memory tokenURIs ) public {
    for (uint256 i = 0; i < tokenIDs.length; i++) {
        LotteryEscrow(tokenContractAddress).setTokenURIs(tokenIDs[i],tokenURIs[i]);
        //_setTokenURI(tokenIDs[i],tokenURIs[i]);
      } 
}
//    function setTokenId(uint256 tokenId, address tokenContractAddress) public {
//     tokenIds[tokenContractAddress].push(tokenId);   
//     }

//    function getCountValue() public view returns(uint256){ 
//     return getNFTCount; 
//     }
function getAllTokenId(address tokenContractAddress) public view returns (uint[] memory){
    uint[] memory ret = new uint[](getNFTCount);
    for (uint i = 0; i < getNFTCount; i++) {
        ret[i] = contractTokenIds[tokenContractAddress][i];
    } 
    return ret;
}

// function play(unit256 tokenId) public returns(uint256){
//     require(ownerOf(tokenId) == msg.sender, "You must own the NFT to play the lottery");
//     require(winner == address(0), "There is already a winner");
//     require(getNFTCount >= 2, "There must be at least 2 sold NFTs");
//     uint256 randomIndex = uint256(keccak256(abi.encodePacked(now, msg.sender))) % getNFTCount;
//     winner = address(uint256(getTokenOwner(randomIndex)));
//    return winner;
// }

//  function bulkSetURI(
//         address tokenAddress, 
//         uint256[] memory tokenIds,
//         uint256 start, 
//         uint256 end, 
//         string[] memory uris 
//     ) public {
//         for (uint256 i = start; i < end; i++) {
//           LotteryEscrow(tokenAddress).setTokenURI(tokenIds[i] , uris[i]);
//             }
//       }

      function callPurchaseItem(
         uint256 tokenId,
         address tokenAddress
      )public payable{
LotteryEscrow(tokenAddress).purchaseItem(tokenId,msg.sender);
      }
// function callURI(
//          address tokenAddress,
//          uint256 tokenId, 
//          string memory tokenURI
//      ) public {
//          LotteryEscrow(tokenAddress).setTokenURI( tokenId, tokenURI);
//      }
//  function getAll() public view returns (address[] memory){
//     address[] memory ret = new address[](getNFTCount);
//     for (uint i = 0; i < getNFTCount; i++) {
//         ret[i] = tokenContracts[i];
//     } 
//     return ret;
// }
    function transferToken(
        address from,
        address payable to,
        address  token,
        uint256 amount
    ) public {
        LotteryEscrow(token).transferTokens(from, to, token, amount);
        emit TokenTransfered(from, to, token, amount);
    }
    
    receive() external payable {}
   
}


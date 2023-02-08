// import React, { useState, createContext, useEffect} from "react";
// import axios from "axios";
// import { ethers } from "ethers";
// // import { Web3Storage } from "web3.storage";
// import { create } from "ipfs-http-client";
// // import { NFTStorage, File } from "nft.storage";
// import { renderToStaticMarkup } from "react-dom/server";
// import {toast} from "react-toastify"
// import { lotteryEscrowParentABI, LotteryEscrowParentContract } from "../abi";
// // import EpnsSDK from "@epnsproject/backend-sdk-staging";
// import { Buffer } from 'buffer'; 


// export const LotteryEscrowContext = createContext();
// export const LotteryEscrowContextProvider = (props) => {
//   const [ImgArr, setImgArr] = useState([]);
//   const [ImgUrl, setImgUrl] = useState();
//   const projectId = process.env.REACT_APP_INFURA_PROJECT_KEY;
//   const projectSecret = process.env.REACT_APP_INFURA_APP_SECRET_KEY;
//   const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
//   const ifpsConfig = {
//     host: 'ipfs.infura.io',
//     port: 5001,
//     protocol: 'https',
//     headers: {
//       authorization: auth,
//     },
//   };
//   const ipfs = create(ifpsConfig);
//   const addDataToIPFS = async (metadata) => {
//     const ipfsHash = await ipfs.add(metadata);
//     console.log(ipfsHash.cid, "IPFSHash cid");
//     console.log(ipfsHash.path, "IPFSHash path");
//     return ipfsHash.path;
//   };
//   const createSvgFromText = (text) => {
//     const imgSVG = (
//       <svg
//         id="mysvg"
//         xmlns="http://www.w3.org/2000/svg"
//         preserveAspectRatio="xMinYMin meet"
//         viewBox="0 0 350 350"
//         fill="#FFC059"
//       >
//         <rect width="200%" height="80%" fill="black" />
//         <text
//           x="50%"
//           y="25%"
//           textAnchor="middle"
//           style={{ fontFamily: "Gochi Hand, cursive", fontSize: "28px" }}
//         >
//           <tspan x="50%" dy="1.2em">
//             {text}
//           </tspan>
//         </text>
//       </svg>
//     );
//     return renderToStaticMarkup(imgSVG);
//   };
//   const convertSVGToBuffer = async (svgElement) => {
//     const svgBuffer = Buffer.from(svgElement);
//     return svgBuffer;
//   }; 
//   async function getImage(){
//     const accounts = await window.ethereum.request({
//       method: "eth_requestAccounts",
//     });
//     const address = accounts[0];
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const signature = await signer.signMessage(address);
//     // console.log(signature, "signture from onFormClick button");
//     const escrowContract = new ethers.Contract(
//       LotteryEscrowParentContract,
//       lotteryEscrowParentABI,
//       signer
//     );
//     const tokenContractAddresss  = localStorage.getItem("tokenContractAddress")
//     let tokenIds = await escrowContract.getAllTokenId(tokenContractAddresss);
//     let tokenIdArr = [];
//     let filesArr = [];
//     let imageArr = [];
//     tokenIds.map(async (tokenId) => {
//       tokenIdArr.push(parseInt(tokenIds.toString()));
//       const imgSVG = createSvgFromText(tokenId.toString());
//       console.log(imgSVG, "imgSVG")
//       const svgImg = await convertSVGToBuffer(imgSVG);
//       const ipfsHash = await addDataToIPFS(svgImg);
//       console.log(ipfsHash, "ipfsHash from addDataToIPFS function");
//       const imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
//       setImgUrl(imageUrl);
//       imageArr.push({ imageUrl: imageUrl, tokenId: tokenId.toString(), sold: false });
//       setImgArr(imageArr);
//     });

//   } 
//   console.log(ImgArr,"img arr from getImage");

//   useEffect(() => {
//     getImage();
//     console.log(ImgArr,"ImgArr from useEffect context");
//   },[]);
  
//     return(
//         <LotteryEscrowContext.Provider 
//            value={{ 
//             ImgUrl,
//             ImgArr,
//            }}>{props.children}</LotteryEscrowContext.Provider>
//     )
// }
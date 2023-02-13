import React, { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import { renderToStaticMarkup } from "react-dom/server";
import { toast } from "react-toastify";
import {
  lotteryEscrowParentABI,
  lotteryEscrowABI,
  LotteryEscrowParentContract,
} from "../abi";
import { Buffer } from "buffer";

export const LotteryEscrowContext = createContext();
const LotteryEscrowContextProvider = (props) => {
  const [authorname, setAuthorname] = useState("");
  const [symbol, setSymbol] = useState("");
  const [tokenPrice, setTokenPrice] = useState("");
  const [tokenQuantity, setTokenQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [AllTokenIds, setAllTokenIds] = useState();
  const [ImgArr, setImgArr] = useState([]);
  const [AllFilesArr, setAllFilesArr] = useState([]);
  const [AllTokenURIs, setAllTokenURIs] = useState([]);
  const [getCollection, setGetCollection] = useState();
  const notify = () => toast("NFT Created Successfully !!");

  const authorNameEvent = (e) => {
    setAuthorname(e.target.value);
  };
  const tokenPriceEvent = (e) => {
    setTokenPrice(e.target.value || null);
  };
  const tokenQuantityEvent = (e) => {
    setTokenQuantity(e.target.value);
  };
  const symbolEvent = (e) => {
    setSymbol(e.target.value);
  };
  //--------------IPFS TOKENID TO IMAGE  -----------//
  const projectId = process.env.REACT_APP_INFURA_PROJECT_KEY;
  const projectSecret = process.env.REACT_APP_INFURA_APP_SECRET_KEY;
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  const ifpsConfig = {
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  };
  const ipfs = create(ifpsConfig);
  const addDataToIPFS = async (metadata) => {
    const ipfsHash = await ipfs.add(metadata);
    // console.log(ipfsHash.cid, "IPFSHash cid");
    // console.log(ipfsHash.path, "IPFSHash path");
    return ipfsHash.path;
  };
  const createSvgFromText = (text) => {
    const imgSVG = (
      <svg
        id="mysvg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMin meet"
        viewBox="0 0 350 350"
        fill="#FFC059"
      >
        <rect width="200%" height="80%" fill="black" />
        <text
          x="50%"
          y="25%"
          textAnchor="middle"
          style={{ fontFamily: "Gochi Hand, cursive", fontSize: "28px" }}
        >
          <tspan x="50%" dy="1.2em">
            {text}
          </tspan>
        </text>
      </svg>
    );
    return renderToStaticMarkup(imgSVG);
  };
  const convertSVGToBuffer = async (svgElement) => {
    const svgBuffer = Buffer.from(svgElement);
    return svgBuffer;
  };
  const currentUserAdd = localStorage.getItem("currentUserAddress");
  async function onFormSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setAuthorname("");
    setTokenPrice("");
    setTokenQuantity("");
    setSymbol("");
    console.log(Item, "form submit");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = accounts[0];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(address);
    const escrowContract = new ethers.Contract(
      LotteryEscrowParentContract,
      lotteryEscrowParentABI,
      signer
    );
    setLoading(false);
    let transactionCreate = await escrowContract.createToken(
      authorname,
      symbol
    );
    let txc = await transactionCreate.wait();
    if (txc) {
      setLoading(false);
      console.log(txc, "Successfully created!");
    }
    let event = txc.events[0];
    let tokenContractAddress = event.args[1];
    let userAdd = localStorage.getItem("currentUserAddress");
    localStorage.setItem("tokenContractAddress", tokenContractAddress);

    setLoading(true);
    let transactionBulkMint = await escrowContract.bulkMintERC721(
      address,
      tokenContractAddress,
      0,
      tokenQuantity,
      ethers.utils.parseUnits(tokenPrice.toString(), "ether")
    );
    let txb = await transactionBulkMint.wait();
    if (txb) {
      setLoading(false);
    }
    let tokenIds = await escrowContract.getAllTokenId(tokenContractAddress);
    let tokenIdArr = [];
    let imageArr = [];
    let filesArr = [];

    var result = await Promise.all(
      tokenIds.map(async (tokenId) => {
        // console.log(parseInt(tokenId), "parseInt(tokenId)");
        tokenIdArr.push(parseInt(tokenId));
        const imgSVG = createSvgFromText(tokenId.toString());
        // console.log(imgSVG, "imgSVG");
        const svgImg = await convertSVGToBuffer(imgSVG);
        const ipfsHash = await addDataToIPFS(svgImg);
        // console.log(ipfsHash, "ipfsHash from addDataToIPFS function");
        const imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
        imageArr.push(imageUrl);
  
        setImgArr(imageArr);
        return imageUrl;
        
        // const tokenURIs = await escrowContract.BulkSetTokenURI(
        //   tokenContractAddress,
        //   tokenIdArr,
        //   imageArr
        // );
        // let txURI = await tokenURIs.wait();
  
        // if (txURI) {
        //   setLoading(false);
        //   const nftContract = new ethers.Contract(
        //     tokenContractAddress,
        //     lotteryEscrowABI,
        //     signer
        //   );
        //   tokenIds.map(async (tokenID) => {
        //     let AllUris = [];
        //     let uriss = await nftContract.tokenURI(parseInt(tokenID));
        //     AllUris.push(uriss);
        //     setAllTokenURIs(AllUris);
        //     console.log(uriss,"AllUris");
        //   });
        //  }
  
        
      })
    ) 

     const blob = new Blob(
      [
        JSON.stringify({
          authorname,
          symbol,
          tokenPrice,
          tokenQuantity,
          result,
        }), 
      ],
      { type: "application/json" }
    );
    const files = [new File([blob], "data.json")];
    const path = await addDataToIPFS(files[0]);
    const uri = `https://ipfs.io/ipfs/${path}`;
    console.log(uri,"last uri")
    filesArr.push(uri);
    setAllFilesArr(filesArr);
    setLoading(false);
    notify();

   const setCollectionOfUri = await escrowContract.setCollectionUri(tokenContractAddress,uri);
   setLoading(true);
   const txs = await setCollectionOfUri.wait();
   if(txs){
    setLoading(false);
    console.log(setCollectionOfUri,"setCollectionOfUris");
   }
  const getCollectionOfUri = await escrowContract.getCollectionUri(tokenContractAddress);
  setGetCollection(getCollectionOfUri);
   console.log(getCollectionOfUri,"getCollectionOfUri");
   
  };
  // useEffect(() => {
  //  console.log(getCollection,"getCollection state");
  // },[getCollection]);
    
  let Item = {
    authorname: authorname,
    tokenPrice: tokenPrice,
    tokenQuantity: tokenQuantity,
    symbol: symbol,
  };

  return (
    <LotteryEscrowContext.Provider
      value={{
        ImgArr,
        AllTokenURIs,
        authorname,
        authorNameEvent,
        symbol,
        symbolEvent,
        tokenPrice,
        tokenPriceEvent,
        tokenQuantity,
        tokenQuantityEvent,
        loading,
        onFormSubmit,
        getCollection
      }}
    >
      {props.children} 
    </LotteryEscrowContext.Provider>
  );
};
export default LotteryEscrowContextProvider;

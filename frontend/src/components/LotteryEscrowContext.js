import React, { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
// import { Web3Storage } from "web3.storage";
import { create } from "ipfs-http-client";
// import { NFTStorage, File } from "nft.storage";
import { renderToStaticMarkup } from "react-dom/server";
import { toast } from "react-toastify";
import {
  lotteryEscrowParentABI,
  lotteryEscrowABI,
  LotteryEscrowParentContract,
} from "../abi";
// import EpnsSDK from "@epnsproject/backend-sdk-staging";
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
  const [ImgUrl, setImgUrl] = useState();
  const [AllTokenURIs, setAllTokenURIs] = useState([]);
  // const NFT_STORAGE_API_TOKEN = process.env.REACT_APP_NFT_STORAGE_API_TOKEN;
  // const client = new NFTStorage({ token: NFT_STORAGE_API_TOKEN });

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
    console.log(ipfsHash.cid, "IPFSHash cid");
    console.log(ipfsHash.path, "IPFSHash path");
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
    console.log(signature, "signture from onFormClick button");
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
    console.log(transactionCreate, "createToken");
    let txc = await transactionCreate.wait();
    if (txc) {
      setLoading(false);
      console.log(txc, "Successfully created!");
    }
    let event = txc.events[0];
    console.log(event, "Event");
    // let tokenContractAddress = event?.address;
    let tokenContractAddress = event.args[1];
    let userAdd = localStorage.getItem("currentUserAddress");
    localStorage.setItem("tokenContractAddress", tokenContractAddress);
    // nftData.set("tokenContractAddress", tokenContractAddress);
    // nftData.set("CurrentUser", userAdd);
    //let userAdd = event.args[0]
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
      try {
        const PK = process.env.REACT_APP_EPNS_PRIVATE_KEY;
        const Pkey = `0x${PK}`;
        // const epnsSdk = new EpnsSDK(Pkey)
        // console.log(epnsSdk, "epnsSDK");
        // const txEPNS = await epnsSdk.sendNotification(
        //   userAdd,
        //   "Hey there",
        //   "Welcome to the BugBuzzer",
        //   `${authorname} Created NFT`,
        //   ` Uploaded collection of ${symbol} NFTs successfully!`,
        // 3, //this is the notificationType
        // '', // a url for users to be redirected to
        // '',// an image url, or an empty string
        // null, //this can be left as null
        // );
        // console.log(txEPNS, "txEPNS");
      } catch (error) {
        console.log(error.response.data, "error.response.data");
      }
      setLoading(false);
    }
    //let tokenCount = await escrowContract.getCountValue();
    let tokenIds = await escrowContract.getAllTokenId(tokenContractAddress);
    let tokenIdArr = [];
    let filesArr = [];
    let imageArr = [];
    tokenIds.map(async (tokenId) => {
      console.log(parseInt(tokenId), "parseInt(tokenId)");
      tokenIdArr.push(parseInt(tokenId));
      const imgSVG = createSvgFromText(tokenId.toString());
      console.log(imgSVG, "imgSVG");
      const svgImg = await convertSVGToBuffer(imgSVG);
      const ipfsHash = await addDataToIPFS(svgImg);
      console.log(ipfsHash, "ipfsHash from addDataToIPFS function");
      const imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
      setImgUrl(imageUrl);
      imageArr.push(imageUrl);
      setImgArr(imageArr);
      console.log(tokenIdArr, "tokenIdArr");
      console.log(imageArr, "imageArr");
      setLoading(true);
      const tokenURIs = await escrowContract.BulkSetTokenURI(
        tokenContractAddress,
        tokenIdArr,
        imageArr
      );
      let txURI = await tokenURIs.wait();
      if (txURI) {
        const nftContract = new ethers.Contract(
          tokenContractAddress,
          lotteryEscrowABI,
          signer
        );
        tokenIds.map(async (tokenID) => {
          let AllUris = [];
          let uriss = await nftContract.tokenURI(parseInt(tokenID));
          AllUris.push(uriss);
          setAllTokenURIs(AllUris);
          console.log(uriss,"AllUris");
        });
        setLoading(false);
        //console.log(AllTokenURIs,"AllTokenURIs in a function");
      }

      const blob = new Blob(
        [
          JSON.stringify({
            authorname,
            symbol,
            tokenPrice,
            tokenQuantity,
            imageUrl,
          }),
        ],
        { type: "application/json" }
      );
      const files = [new File([blob], "data.json")];
      const path = await addDataToIPFS(files[0]);
      const uri = `https://ipfs.io/ipfs/${path}`;
      console.log(uri);
      filesArr.push(uri);
      // const metadata = await client.store({
      //   name:  authorname,
      //   description: 'NFT',
      //   symbol: symbol,
      //   tokenPrice : tokenPrice,
      //   tokenQuantity : tokenQuantity,
      //   image: imageUrl,

      // });
      // console.log(metadata,"Metadata of NFT Storage");
    });

    console.log(filesArr, "filesArr");
    console.log(ImgArr, "ImgArr");

    setLoading(false);
    notify();
  }
  //console.log(ImgArr, "ImgArr22");
  //console.log(AllTokenURIs, "AllTokenURIs out of a function");

  let Item = {
    authorname: authorname,
    tokenPrice: tokenPrice,
    tokenQuantity: tokenQuantity,
    symbol: symbol,
  };

  // const notify = () => toast("NFTs are uploaded!");
  return (
    <LotteryEscrowContext.Provider
      value={{
        ImgUrl,
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
        onFormSubmit
      }}
    >
      {props.children} 
    </LotteryEscrowContext.Provider>
  );
};
export default LotteryEscrowContextProvider;

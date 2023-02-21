import React, { useEffect, useState } from "react";
import { lotteryEscrowParentABI, lotteryEscrowABI, LotteryEscrowParentContract } from "../abi";
import { LotteryEscrowContext } from './LotteryEscrowContext';
import { ethers } from "ethers";
import axios from "axios";
function NftReadership() {
  
  const lotteryContext = React.useContext(LotteryEscrowContext);
  const { getCollection } = lotteryContext;
  const [collectionUris, setCollectionUris] = useState([]);
  const [Img, setImg] = useState([]);
  async function getAllCollection(){
  let getCollectionOfUri;
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const address = accounts[0];
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  // const signature = await signer.signMessage(address);
  const escrowContract = new ethers.Contract(
    LotteryEscrowParentContract,
    lotteryEscrowParentABI,
    signer
  );
  
  const allContractAddresses = await escrowContract.getContractAddresses();
  
  const collectionUris = await Promise.all(
    allContractAddresses.map(async(addrs) => {
      const uri = await escrowContract.getCollectionUri(addrs);
      return {address: addrs, uri: uri};
    })

  );
  setCollectionUris(collectionUris);
}
useEffect(() => {
  getAllCollection();
  
}, []);
useEffect(() => {
  console.log(collectionUris,"collectionUris")
  let images = [];

  collectionUris.map((collection) => {
    axios.get(collection.uri)
    .then((response) => {
     
      let obj = {};
      obj.address = collection.address;
      obj.name = response.data.authorname;
      obj.images = [];

      response.data.result.map((uri) => {

        obj.images.push(uri);
        
        // console.log(uri, "uri");
     })
     images.push(obj);
     setImg(images);
      // console.log(response.data.result,"response");
    })
    .catch((err) => {
      console.log(err,"error from axious response");
    })
   })
},[collectionUris])




  return (
    <div style={{ marginTop: "120px", listStyle: "none" }} className="container footer-top">
      <h1 className="form-style-2-heading">Explore collections</h1>
      <div className="row">
        {/* {collectionUris.map(uri =>
  ( */}
        {/* <div key={uri}> */}
            <h1>NFT Images</h1>
            {console.log(Img,"Img")}
   {Img.map((i) =>{
    return (
     <>
     <div>{i.address}</div>
     <div>{i.name}</div>

     {i.images.map((url) => {
        return ( <img src={url} height="200px" width="500px"/>)
     })}
     </>
    )
   })}
          </div>
        {/* ))} */}
      </div>
    // </div>

  );
}
export default NftReadership;
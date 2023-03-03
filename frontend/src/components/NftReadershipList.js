import React, { useEffect, useState } from "react";
import { lotteryEscrowParentABI, lotteryEscrowABI, LotteryEscrowParentContract, LotteryEscrowChildContract} from "../abi";
import { LotteryEscrowContext } from './LotteryEscrowContext';
import { ethers } from "ethers";
import axios from "axios";

function NftReadership() {
  
  const lotteryContext = React.useContext(LotteryEscrowContext);
  const { getCollection } = lotteryContext;
  const [collectionUris, setCollectionUris] = useState([]);
  const [Img, setImg] = useState([]);
  const [allTokenIds, setAllTokenIds] = useState();
  const [tokenAddresses, setTokenAddresses] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
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
  console.log(escrowContract,"escrowContract")
  const lotteryChildContract = new ethers.Contract(
   LotteryEscrowChildContract,
   lotteryEscrowABI,
   signer
  );
  
  const allContractAddresses = await escrowContract.getContractAddresses();
  
  const collectionUris = await Promise.all(
    allContractAddresses.map(async(addrs) => {
      const uri = await escrowContract.getCollectionUri(addrs);
      // const tokenId = await escrowContract.getAllTokenId(addrs);
      // console.log(tokenId, "tokenIds");
      return {address: addrs, uri: uri};
    })

    );
  setCollectionUris(collectionUris);
}
async function purchaseItem(tokenID, address, price){
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrowContract = new ethers.Contract(
    LotteryEscrowParentContract,
    lotteryEscrowParentABI,
    signer
  );
  console.log(tokenID,address, price,"safdsfds")
  const purchaseItem = await escrowContract.callPurchaseItem(tokenID,address, LotteryEscrowParentContract,{ value: ethers.utils.parseUnits(price,"ether")});
  await purchaseItem.wait();
}
useEffect(() => {
  getAllCollection();
}, []);

useEffect(() => {
  console.log(collectionUris,"collectionUris")
  let images = [];

  collectionUris.map(async(collection) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrowContract = new ethers.Contract(
    LotteryEscrowParentContract,
    lotteryEscrowParentABI,
    signer
  );
  // let tokenIds = await escrowContract.getAllTokenId(collection.address);
  // setAllTokenIds(tokenIds.toString());
    axios.get(collection.uri)
    .then((response) => {
     console.log(response,"response");
      let obj = {};
      obj.address = collection.address;
      obj.name = response.data.authorname;
      obj.price = response.data.tokenPrice;
      // tokenIds.map((id) => {
      //   obj.tokenIds =  id.toString();
      
      //  })
      obj.images = [];

      response.data.result.map((uri) => {

        obj.images.push(uri);
      })
     images.push(obj);
     setImg(images);
    })
    .catch((err) => {
      console.log(err,"error from axious response");
    })
   })
},[collectionUris])




  return (
<div style={{ marginTop: "130px", listStyle: "none" }} className="container footer-top">
<div className="col-md-3 col-sm-6">
                      <div className="card-readership-detail card-block">
                        <h4 className="card-title-readership text-right"></h4>
      <h1 className="form-style-2-heading">Explore collections</h1>

            {console.log(Img,"Img")}  
  {Img.length > 0 ? 
    <div className="row">
   {Img.map((i) =>{
    return (
     <>
     <h5 className = "card-title-readership mt-3 mb-3">{i.address}</h5>
     <br />
     <h5 className = "card-title-readership mt-3 mb-3">{i.name}</h5>
     {i.images.map((img) => {
        return (
          <>
           <img src={img.url} height="200px" width="500px"/>
           <button class="btn btn-outline-success mb-5" onClick={() => purchaseItem(img.tokenID, i.address, i.price)}>Buy for {i.price}</button>
           </>
           )
          
     })}
     </>
    )
   })}
   </div>
     : (
   <main style={{ padding: "1rem 0"}}>
    <h2>No Listed assets</h2>
   </main>
  )
  }
</div>  
</div>
</div>
  );
}
export default NftReadership;
import React, { useEffect, useState } from "react";
import { lotteryEscrowParentABI, lotteryEscrowABI, LotteryEscrowParentContract } from "../abi";
import { LotteryEscrowContext } from './LotteryEscrowContext';
function NftReadership() {
  
  const lotteryContext = React.useContext(LotteryEscrowContext);
  const { AllTokenURIs } = lotteryContext;
console.log(AllTokenURIs,'data');  
  return (

    <div style={{ marginTop: "120px", listStyle: "none" }} className="container footer-top">
      <h1 className="form-style-2-heading">Explore collections</h1>
      <div className="row">
      {/* {
AllTokenURIs.map((uri) => {

  return(
    <img src={uri} alt="Image of URI"/>

  ); 

})
      } */}
      <img src = {AllTokenURIs} alt="AllTokenURIs"/>
      </div>
    </div>
  );
}
export default NftReadership;
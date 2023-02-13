import React, { useEffect, useState } from "react";
import { lotteryEscrowParentABI, lotteryEscrowABI, LotteryEscrowParentContract } from "../abi";
import { LotteryEscrowContext } from './LotteryEscrowContext';
function NftReadership() {
  
  const lotteryContext = React.useContext(LotteryEscrowContext);
  const { getCollection } = lotteryContext;
  console.log(getCollection,'data from NFTReadership Collection');

  return (

    <div style={{ marginTop: "120px", listStyle: "none" }} className="container footer-top">
      <h1 className="form-style-2-heading">Explore collections</h1>
      <div className="row">

      </div>
    </div>
  );
}
export default NftReadership;
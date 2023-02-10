import React from 'react'
import { LotteryEscrowContext } from './LotteryEscrowContext';
 

const UploadForm = () => {
    const lotteryContext = React.useContext(LotteryEscrowContext);
const { authorname,
    authorNameEvent,
    symbol,
    symbolEvent,
    tokenPrice,
    tokenPriceEvent,
    tokenQuantity,
    tokenQuantityEvent,
    loading,
    onFormSubmit } = lotteryContext;
  return (
<div>
      <div
      style={{ backgroundColor: "#faf7f8", marginTop: "18%", marginLeft: "19%"  }}
      className="col footer-top">     
     <div className="form-style-2 offset-4 row-8"> 
            <div className="form-style-2-heading-title">Create NFT Learners club</div>        <form action="" method="" onSubmit={onFormSubmit}>          <label for="field1">            <span>              Name <span className="required">*</span>            </span>            <input
              value={authorname}
              onChange={authorNameEvent}
              placeholder="Your name"
              type="text"
              class="input-field"
              name="field1"
            />          </label>{" "}
          <br />         
           <label for="field1"><span>Symbol<span className="required">*</span> </span> 
           <input
              value={symbol}
              onChange={symbolEvent}
              placeholder="Enter symbol"
              type="text"
              class="input-field"
              name="field1"
              symbol={symbol}
            /> 
          </label>{" "}
          <br />          {/* <label for="field4"><span>Not NFT holder</span><select value={category} name="field4" onChange={(e)=>setNoNFT(e.target.value)} className="select-field">                        <option defaultChecked defaultValue="free" value="free">Post story for free</option>                        <option value="charge">Documents</option>                    </select></label> */}
          <label for="field1"> 
           <span>tokenPrice <span className="required">*</span>            </span>            <input
              value={tokenPrice}
              onChange={tokenPriceEvent}
              placeholder="Enter a token price"
              type="text"
              class="input-field"
              name="field1"
            /> </label>{" "}
          <br />
          <label for="field1"><span>tokenQuantity<span className="required">*</span></span>
          <input
              value={tokenQuantity}
              onChange={tokenQuantityEvent}
              placeholder="Enter quantity"
              type="text"
              class="input-field"
              name="field1"
            /></label><br /><br />
            <input
            type="submit"
            value={loading ? "Loading...." : "Submit"}
            style={{ backgroundColor: "#D82148", marginLeft: "120px" }}
            // onClick={notify}
            disabled={loading}
          /> 
          </form>
          </div> 
          </div>
          </div>
            )
}

export default UploadForm
import React from 'react'
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Stack, Box } from "@mui/material";

const Header = () => {
  return (
    <AppBar color="inherit" position="fixed" sx={{ height: "70px" }}>
    <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'end', marginTop: "8px" }}>
        <Link to="upload-form-nft">
          <label className="addtute" style={{
            color: "#151D3B", fontFamily: "inherit", marginTop: "20px", marginRight: "41px"
          }} >Upload NFT</label>
        </Link>
        <Link to="nftlist">
          <label className="addtute" style={{
            color: "#151D3B", fontFamily: "inherit", marginTop: "20px", marginRight: "41px"
          }} >Lottery NFTs</label>
        </Link>


</div>
    </Toolbar>
  </AppBar>  
  )
}

export default Header
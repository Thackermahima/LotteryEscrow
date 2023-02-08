 
import './App.css';
import UploadFormNft from './components/UploadFormNft';
import { Routes, Route } from 'react-router-dom';
import NftReadership from './components/NftReadershipList';
import Header from './Header';
function App() {
  return (
    <>
    <Header />
    <Routes>
    <Route path="/upload-form-nft" element={ <UploadFormNft/>} />
    <Route path="/nftlist" element={ <NftReadership/>} />

    </Routes>
    </>
  );
}

export default App;

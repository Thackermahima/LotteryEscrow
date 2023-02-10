 
import './App.css';
import LotteryEscrowContext from './components/LotteryEscrowContext';
import UploadForm from './components/UploadForm';
import { Routes, Route } from 'react-router-dom';
import NftReadership from './components/NftReadershipList';
import Header from './Header';
function App() {
  return (
    <>
    <Header />
    <Routes>
    <Route path="/upload-form-nft" element={ <UploadForm />} />
    <Route path="/nftlist" element={ <NftReadership/>} />

    </Routes>
    </>
  );
}

export default App;

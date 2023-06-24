import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import contractABI from './contract/ABI.json';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import axios from 'axios';

function App() {
  const [contractAddress, setContractAddress] = useState('0x2b2873C361b5D210328b3C27719D404ED3DacFBb');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [data, setData] = useState({name: '', symbol: ''});
  const SERVER_URL = 'http://localhost:4000/events';
  const updateData = (key, value) => {
    const dataCopy = {...data};
    dataCopy[key] = value
    setData(dataCopy);
  }
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  const handleCreateCollection = async () => {
    setError('');
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await contract.methods.createCollection(data.name, data.symbol).send({ from: accounts[0] });
      setSuccess('Collection created')
    } catch (error) {
      setError(error.message)
      console.error(error.message);
    }
  };


  contract.events.CollectionCreated({}, async (error, event) => {
    if (!error) {
      await axios.post(SERVER_URL, event);
      setSuccess('Event has added to store')
      console.log(event);
    } else {
      setError(error.message)
      console.error(error);
    }

  })

  contract.events.TokenMinted({}, async (error, event) => {
    if (!error) {
      await axios.post(SERVER_URL, event);
      console.log(event);
      setSuccess('Event has added to store')
    } else {
      setError(error.message)
      console.error(error);
    }
  })

  
  const handleMintToken = async () => {
    setError('');
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await contract.methods.mintToken().send({ from: accounts[0] });
      setSuccess('Collection created')
      console.log('Token minted');
    } catch (error) {
      setError(error.message)
      console.error(error);
    }
  };
  
  return (
    <div className="App">
      {error && <Alert style={{marginTop: 50}} severity="error">{error}</Alert>}
      {success && <Alert style={{marginTop: 50}} severity="success">{success}</Alert>}
      <h1>Create and ming NFT collection</h1>
      <TextField onChange={(e) => updateData('name', e.target.value)} id="filled-basic" label="Name" variant="filled" />
      <TextField onChange={(e) => updateData('symbol', e.target.value)} id="filled-basic" label="Symbol" variant="filled" />
      <Button onClick={handleCreateCollection} variant="contained">Create</Button>
      <Button onClick={handleMintToken} variant="outlined">Mint</Button>
    </div>
  );
}

export default App;

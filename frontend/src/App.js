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
  const [contractAddress, setContractAddress] = useState('0xd38d9f11cca0df593dAc45Eb5741Ec3e5A65D519');
  const [error, setError] = useState('');
  const [data, setData] = useState({name: '', symbol: '', address: ''});
  const SERVER_URL = 'http://localhost:4000/events';
  const updateData = (key, value) => {
    const dataCopy = {...data};
    dataCopy[key] = value
    setData(dataCopy);
  }
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(contractABI, data.address);

  const handleCreateCollection = async () => {
    setError('');
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await contract.methods.createCollection(data.name, data.symbol).send({ from: accounts[0] });
      console.log('Collection created');
    } catch (error) {
      setError(error.message)
      console.error(error.message);
    }
  };

  const collectionCreatedEvent = contract.events.CollectionCreated;
  const tokenMintedEvent = contract.events.TokenMinted;

  collectionCreatedEvent({})
  .on('data', async (event) => {
    await axios.post(SERVER_URL, event);
    console.log(event);
  })
  .on('error', (error) => {
    setError(error.message)
    console.error(error);
  });

  tokenMintedEvent({})
  .on('data', async (event) => {
    await axios.post(SERVER_URL, event);
    console.log(event);
  })
  .on('error', (error) => {
    setError(error.message)
    console.error(error);
  });

  
  const handleMintToken = async () => {
    setError('');
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await contract.methods.mintToken().send({ from: accounts[0] });
      console.log('Token minted');
    } catch (error) {
      setError(error.message)
      console.error(error);
    }
  };
  
  return (
    <div className="App">
      {error && <Alert style={{marginTop: 50}} severity="error">{error}</Alert>}
      <h1>Create and ming NFT collection</h1>
      <TextField onChange={(e) => updateData('address', e.target.value)} id="filled-basic" label="Wallet" variant="filled" />
      <TextField onChange={(e) => updateData('name', e.target.value)} id="filled-basic" label="Name" variant="filled" />
      <TextField onChange={(e) => updateData('symbol', e.target.value)} id="filled-basic" label="Symbol" variant="filled" />
      <Button onClick={handleCreateCollection} variant="contained">Create</Button>
      <Button onClick={handleMintToken} variant="outlined">Mint</Button>
    </div>
  );
}

export default App;

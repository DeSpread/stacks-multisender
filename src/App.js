import './App.css';
import {Signin} from "./component/Signin";
import {Send} from "./component/Send"
import {Connect} from '@stacks/connect-react';
import {useConnect} from './lib/auth'
import {
  Alert,
  AppBar,
  Box,
  Container, FormControl,
  Grid,
  InputLabel,
  MenuItem, Select, TextField,
  Toolbar,
  Typography
} from '@mui/material';
import {FixedSizeList} from 'react-window'
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import CSVReader from 'react-csv-reader'


function App() {
  const {authOptions, userSession} = useConnect()
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [recipients, setRecipients] = useState([{}]);
  const [targetToken, setTargetToken] = useState('STX');
  const [showSample, setShowSample] = useState(false)
  let transferData = [];

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
  };
  const csvOnLoaded = (data, fileInfo) => {
    console.log("csvOnLoaded")
    setRecipients(data)
    console.log(data, fileInfo);
  }
  const csvHandleError = (err, fileInfo) => {
    console.log(err);
  }

  useEffect(() => {
    transferData = [...recipients]
    setIsSignedIn(userSession.isUserSignedIn())
  })


  function handleTokenSelected(event) {
    setTargetToken(event.target.value);
  }

  function setTransferData(index, key, event) {
    transferData[index][key] = event.target.value;
  }

  function toggleShowSample(){
    setShowSample(!showSample)
  }

  function renderRow(props) {
    const {index, style} = props;

    return (
      <div style={style} key={index + new Date()}>
        <Box sx={{textAlign: "center"}}>
          <Button disabled sx={{marginRight: "30px", height: "50px"}}>#{index + 1}</Button>
          <TextField size="small" id="address" label="address" variant="standard"
                     sx={{width: "600px", paddingRight: "40px", height: "50px"}}
                     defaultValue={recipients[index] ? recipients[index]['address'] : ''}
                     onChange={(event) => setTransferData(index, 'address', event)}/>
          <TextField size="small" id="amount" type="number" label="amount" variant="standard"
                     sx={{paddingRight: "60px", height: "50px"}}
                     defaultValue={recipients[index] ? recipients[index]['amount'] : ''}
                     onChange={(event) => setTransferData(index, 'amount', event)}/>
          <Button variant="text" sx={{height: "50px"}} onClick={() => {
            let removed = recipients.filter((value, lIndex) => index !== lIndex)
            setRecipients(removed)
          }}>DELETE</Button>
        </Box>
      </div>
    );
  }

  return (
    <Container sx={{backgroundColor: "white", marginTop: "20px", boxShadow: "1px 3px 15px grey", borderRadius: "10px"}}>
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit" component="div">
              Stacks MultiSender
            </Typography>
            <Box sx={{flexGrow: 1}}/>
            <Signin isSignedIn={isSignedIn} sx={{marginRight: '0px'}}/>
          </Toolbar>
        </AppBar>
      </Box>

      <br/>

      <Alert severity="success">
        It only supports 1 million units. And not support send with memo.

      </Alert>

      <Box sx={{display: "flex", flexGrow: 1}}>
        <Box sx={{textAlign: "Center"}}>
        </Box>
        <Box sx={{flexGrow: 1}}/>
        <Box>
          <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
            <InputLabel id="targetTokenSelect-label">Token</InputLabel>
            <Select
              labelId="targetTokenSelect"
              id="targetTokenSelect"
              value={targetToken}
              onChange={handleTokenSelected}
              label="Token"
            >
              <MenuItem value={'STX'} onChange={()=>setTargetToken('STX')}>STX</MenuItem>
              <MenuItem value={'XBTC'} onChange={()=>setTargetToken('XBTC')}>XBTC</MenuItem>
              <MenuItem value={'ALEX'} onChange={()=>setTargetToken('ALEX')}>ALEX</MenuItem>
              <MenuItem value={'DIKO'} onChange={()=>setTargetToken('DIKO')}>DIKO</MenuItem>
              <MenuItem value={'USDA'} onChange={()=>setTargetToken('USDA')}>USDA</MenuItem>
              <MenuItem value={'WELSH'} onChange={()=>setTargetToken('WELSH')}>WELSH</MenuItem>
              <MenuItem value={'NYC'} onChange={()=>setTargetToken('NYC')}>NYC</MenuItem>
              <MenuItem value={'MIA'} onChange={()=>setTargetToken('MIA')}>MIA</MenuItem>
              <MenuItem value={'SUSDT'} onChange={()=>setTargetToken('SUSDT')}>SUSDT</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{boxShadow: "1px 1px 3px grey"}}>
        <FixedSizeList
          height={400}
          itemSize={46}
          itemCount={recipients.length}
          overscanCount={5}
        >
          {renderRow}
        </FixedSizeList>
      </Box>

      <br/>

      <Grid container>
        <Grid sm={7} md={9}/>
        <Grid sm={5} md={3} sx={{display: 'flex', textAlign: 'right'}}>
          <Button variant="contained" sx={{width: '100%', marginRight: "20px"}} onClick={() => {
            let newRecipients = [...transferData];
            newRecipients.push({});
            setRecipients(newRecipients);
          }}>Add</Button>
          <Button variant="contained" sx={{width: '100%'}} onClick={() => {
            let newRecipients = [...transferData];
            newRecipients.pop();
            setRecipients(newRecipients);
          }}>Remove</Button>
        </Grid>
      </Grid>
      <br/>


      <Alert severity="info">
        <Box sx={{display: "flex"}}>
          <CSVReader
            label="Select CSV file. File Header must be address, amount."
            onFileLoaded={csvOnLoaded}
            onError={csvHandleError}
            parserOptions={papaparseOptions}
            inputStyle={{color: 'red'}}
          />
        </Box>
      </Alert>
      <Box sx={{textAlign: "center"}}>
        <Box onClick={()=>toggleShowSample()}>
          <Button>CSV Sample</Button>
        </Box>
        <Box display={showSample? "": "none"}>
          <img src="/sample.png"/>
        </Box>
      </Box>

      <br/>
      <Box sx={{textAlign: "center"}}>
        <Connect authOptions={authOptions}>
          <Send targetToken = {targetToken} isSignedIn={isSignedIn} recipients={recipients}/>
        </Connect>
      </Box>
      <Box sx={{display: "flex", marginTop: "30px", marginBottom: "30px", justifyContent: "center", paddingBottom: "15px"}}>
        <img src="/twitter.png" height="30px"/>
        <Typography sx={{fontSize: "13px", paddingTop: "3px", color: "#1d83ff"}}> <a href="https://twitter.com/NFP2021" style={{textDecoration: "none", color: "#1d83ff"}}>@NFP2021</a></Typography>
      </Box>
    </Container>
  );
}

export default App;

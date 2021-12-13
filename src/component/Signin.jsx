import React from 'react';
import Button from '@mui/material/Button';
import {useConnect} from '../lib/auth';

export const Signin = (props) => {
  const {handleOpenAuth, handleSignOut} = useConnect();

  if(!props.isSignedIn){
    return (
      <Button variant="contained" color={"primary"} onClick={() => handleOpenAuth()}>Connect</Button>
    )
  }
  else{
    return(
      <Button variant="contained" color={"primary"} onClick={() => handleSignOut()}>SignOut</Button>
    )
  }
}
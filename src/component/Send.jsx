import Button from "@mui/material/Button";
import React, {useState} from "react";
import {Box, Snackbar} from "@mui/material";
import {CONTRACT, MAX_SEND_SIZE, NETWORK} from "../config/contract";
import {
  createAssetInfo,
  FungibleConditionCode,
  listCV,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  PostConditionMode, standardPrincipalCV, uintCV
} from "@stacks/transactions";
import {useConnect} from "@stacks/connect-react";
import {useStxAddresses} from "../lib/hooks";
import {userSessionState} from "../lib/auth"
import {useAtomValue} from "jotai/utils";

function checkRecipients(recipients) {
  let check = true;
  recipients.forEach((recipient) => {
    if (!recipient['address'] || !recipient['amount']) {
      check = false;
      return false;
    }
    try {
      standardPrincipalCV(recipient.address)
      uintCV(recipient.amount)
    } catch (e) {
      check = false;
      return false;
    }
  })
  return check;
}


export function Send(props) {
  const userSession = useAtomValue(userSessionState);
  const {doContractCall} = useConnect();
  const {ownerStxAddress} = useStxAddresses(userSession);
  const [state, setState] = useState({
    open: false,
    message: ''
  });

  const handleClose = () => {
    setState({...state, open: false});
  };

  const {message, open} = state

  const sendAction = async (token, recipients, hasMemos) => {
    const contract = CONTRACT[token];
    console.log(contract);
    const contractAddress = contract['contractAddress'];
    const contractName = contract['contractName'];
    const functionName = contract['sendManyFunctionName'];
    const mapper = contract['mapper'];
    const transferUnit = contract['transferUnit']

    const chunk = recipients.length % MAX_SEND_SIZE === 0 ? recipients.length / MAX_SEND_SIZE : parseInt(recipients.length / MAX_SEND_SIZE) + 1;
    console.log(chunk);
    const chunked = [];

    let start = 0
    for (let i = 0; i < chunk; i++) {
      let end = start + MAX_SEND_SIZE < recipients.length ? start + MAX_SEND_SIZE : recipients.length;
      chunked.push(recipients.slice(start, end))
      start += MAX_SEND_SIZE
    }

    for (let i = 0; i < chunked.length; i++) {
      let chunkedRecipients = chunked[i]

      let totalMount = chunkedRecipients.map(recipient => parseInt(recipient.amount))
        .reduce((prev, next) => prev + next) * transferUnit

      let functionArgs = [
        listCV(
          chunkedRecipients.map(mapper)
        ),
      ];

      let postCondition
      if (token === 'STX') {
        postCondition = makeStandardSTXPostCondition(
          ownerStxAddress,
          FungibleConditionCode.Equal,
          parseInt(totalMount)
        );
      } else {
        let assetAddress = contract['assetAddress']
        let assetContractName = contract['assetContractName']
        let assetName = contract['assetName']
        postCondition = makeStandardFungiblePostCondition(
          ownerStxAddress,
          FungibleConditionCode.GreaterEqual,
          parseInt(totalMount),
          createAssetInfo(
            assetAddress,
            assetContractName,
            assetName
          )
        )
      }

      await doContractCall({
        contractAddress,
        contractName,
        functionName,
        functionArgs,
        network: NETWORK,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          postCondition,
        ],
        onFinish: data => {
          console.log(data);
          console.log("finished")
        },
        onCancel: () => {
          console.log("cancled");
        },
      });
    }
  }

  return (
    <Box sx={{textAlign: "center"}}>
      <Button variant="contained" sx={{width: '300px'}} onClick={() => {
        if (!checkRecipients(props.recipients)) {
          setState({
            open: true,
            message: 'Please Check Address or amount. Hint) Address Must start with s, 41 character'
          })
          return;
        }
        sendAction(props.targetToken, props.recipients, false)
      }} disabled={!userSession.isUserSignedIn()}>Send</Button>
      <Snackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={message}
      />
    </Box>
  );
};
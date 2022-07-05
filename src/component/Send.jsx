import Button from "@mui/material/Button";
import React, {useState} from "react";
import {Box, Snackbar} from "@mui/material";
import {CONTRACT, MAX_SEND_SIZE, NETWORK} from "../config/contract";
import {
  contractPrincipalCV,
  createAssetInfo,
  FungibleConditionCode,
  listCV,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  PostConditionMode,
  standardPrincipalCV,
  tupleCV,
  uintCV
} from "@stacks/transactions";
import {useConnect} from "@stacks/connect-react";
import {useStxAddresses} from "../lib/hooks";
import {userSessionState} from "../lib/auth"
import {useAtomValue} from "jotai/utils";

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

  function checkRecipients(recipients) {
    let check = true;
    let message = '';
    recipients.forEach((recipient) => {
      console.log(recipient);
      if (!recipient['address'] || !recipient['amount']) {
        check = false;
        message = 'Address or amount cant be empty'
        return false;
      }
      try {
        standardPrincipalCV(recipient.address)
        // uintCV(recipient.amount) // uint 검사 스킵
      } catch (e) {
        check = false;
        message = e.message
        return false;
      }
    })
    return {
      check: check,
      message: message
    };
  }

  const {message, open} = state

  const sendAction = async (token, recipients, hasMemos) => {
    const contract = CONTRACT[token];
    const contractAddress = contract['contractAddress'];
    const contractName = contract['contractName'];
    const functionName = contract['sendManyFunctionName'];
    const transferUnit = contract['transferUnit']

    const chunk = recipients.length % MAX_SEND_SIZE === 0 ? recipients.length / MAX_SEND_SIZE : parseInt(recipients.length / MAX_SEND_SIZE) + 1;
    const chunked = [];

    let start = 0
    for (let i = 0; i < chunk; i++) {
      let end = start + MAX_SEND_SIZE < recipients.length ? start + MAX_SEND_SIZE : recipients.length;
      chunked.push(recipients.slice(start, end))
      start += MAX_SEND_SIZE
    }

    for (let i = 0; i < chunked.length; i++) {
      let chunkedRecipients = chunked[i]

      let totalMount = chunkedRecipients.map(recipient => parseFloat(recipient.amount))
        .reduce((prev, next) => prev + next) * transferUnit

      totalMount = parseInt(totalMount.toFixed());

      let postCondition
      let functionArgs
      if (token === 'STX') {
        postCondition = makeStandardSTXPostCondition(
          ownerStxAddress,
          FungibleConditionCode.Equal,
          totalMount
        );
        functionArgs = [
          listCV(
            chunkedRecipients.map((recipient) => {
              return tupleCV({
                to: standardPrincipalCV(recipient.address),
                ustx: uintCV(parseInt((parseFloat(recipient.amount) * transferUnit).toFixed()))
              })
            })
          )
        ]
      } else {
        let assetAddress = contract['assetAddress']
        let assetContractName = contract['assetContractName']
        let assetName = contract['assetName']
        postCondition = makeStandardFungiblePostCondition(
          ownerStxAddress,
          FungibleConditionCode.GreaterEqual,
          totalMount,
          createAssetInfo(
            assetAddress,
            assetContractName,
            assetName
          )
        )

        functionArgs = [
          listCV(
            chunkedRecipients.map((recipient) => {
              console.log('recipient.amount: ' + recipient.amount + ', ' + parseInt((parseFloat(recipient.amount) * transferUnit).toFixed()));

              return tupleCV({
                sender: standardPrincipalCV(ownerStxAddress),
                recipient: standardPrincipalCV(recipient.address),
                amount: uintCV(parseInt((parseFloat(recipient.amount) * transferUnit).toFixed()))
              })
            })
          ),
          contractPrincipalCV(contract['assetAddress'], contract['assetContractName'])
        ]
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
        let checkResult = checkRecipients(props.recipients)
        if (!checkResult.check) {
          setState({
            open: true,
            message: 'Please Check Address or amount. Hint) ' + checkResult.message
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
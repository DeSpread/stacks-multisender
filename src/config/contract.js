import { StacksTestnet, StacksMainnet } from '@stacks/network';
import {testnet, mainnet} from '../lib/constants'
import {noneCV, standardPrincipalCV, tupleCV, uintCV} from "@stacks/transactions";

export const MAX_SEND_SIZE = 200;

const TEST_CONTRACT = {
  STX: {
    contractAddress: 'STK42M5PXE9MHC8JYCK491YRNEK8E94HTGF7JMZ5',
    contractName: 'send-many',
    sendManyFunctionName: 'send-many',
    mapper: (recipient) => {
      return tupleCV({
        to: standardPrincipalCV(recipient.address),
        ustx: uintCV(parseInt(recipient.amount) * 1000000)
      });
    },
    transferUnit: 1000000,
  }
}

const MAIN_CONTRACT = {
  STX: {
    contractAddress: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
    contractName: 'send-many',
    sendManyFunctionName: 'send-many',
    mapper: (recipient) =>{
      return tupleCV({ to: standardPrincipalCV(recipient.address), ustx: uintCV(parseInt(recipient.amount) * 1000000)});
    },
    transferUnit: 1000000,
  },
  ABC: {
    contractAddress: 'SP1WBNM0A4ZVY1GVZMXDPMV831BF0BMHFJK9ZXNRW',
    contractName: 'abc-abc-abc',
    sendManyFunctionName: 'send-many',
    assetAddress: 'SP1WBNM0A4ZVY1GVZMXDPMV831BF0BMHFJK9ZXNRW',
    assetContractName: 'abc-abc-abc',
    assetName: 'assetName',
    mapper: (recipient) =>{
      return tupleCV({ to: standardPrincipalCV(recipient.address), amount: uintCV(parseInt(recipient.amount) * 1000000), memo: noneCV() });
    },
    transferUnit: 1000000,
  },
  MIA: {
    contractAddress: 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27',
    contractName: 'miamicoin-token',
    sendManyFunctionName: 'send-many',
    assetAddress: 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27',
    assetContractName: 'miamicoin-token',
    assetName: 'miamicoin',
    mapper: (recipient) =>{
      return tupleCV({ to: standardPrincipalCV(recipient.address), amount: uintCV(parseInt(recipient.amount)), memo: noneCV() });
    },
    transferUnit: 1
  }
}

// export const CONTRACT_ADDRESS = testnet ? TEST_CONTRACT_ADDRESS : MAIN_CONTRACT_ADDRESS;
export const CONTRACT = testnet? TEST_CONTRACT : MAIN_CONTRACT;
export const SEND_MANY_FUNCTION_NAME = 'send-many';
export const NETWORK = testnet? new StacksTestnet() : new StacksMainnet();
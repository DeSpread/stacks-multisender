import {StacksTestnet, StacksMainnet} from '@stacks/network';
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

const FUNGIBLE_CONTRACT = {
  contractAddress: 'SP1W7X92JG1BYPKG15KTS6398XN4D4HJP9TTXMQ38',
  contractName: 'multi-send',
  sendManyFunctionName: 'multi-send'
}

const MAIN_CONTRACT = {
  STX: {
    contractAddress: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
    contractName: 'send-many',
    sendManyFunctionName: 'send-many',
    transferUnit: 1000000,
  },
  ALEX: {
    ...FUNGIBLE_CONTRACT,
    assetAddress: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
    assetContractName: 'age000-governance-token',
    assetName: 'alex',
    transferUnit: 100000000
  },
  DIKO: {
    ...FUNGIBLE_CONTRACT,
    assetAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
    assetContractName: 'arkadiko-token',
    assetName: 'diko',
    transferUnit: 1000000
  },
  XBTC: {
    ...FUNGIBLE_CONTRACT,
    assetAddress: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR',
    assetContractName: 'Wrapped-Bitcoin',
    assetName: 'wrapped-bitcoin',
    transferUnit: 100000000
  },
  USDA: {
    ...FUNGIBLE_CONTRACT,
    assetAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
    assetContractName: 'usda-token',
    assetName: 'usda',
    transferUnit: 1000000
  },
  WELSH: {
    ...FUNGIBLE_CONTRACT,
    assetAddress: 'SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G',
    assetContractName: 'welshcorgicoin-token',
    assetName: 'welshcorgicoin',
    transferUnit: 1000000
  },
  NYC:{
    ...FUNGIBLE_CONTRACT,
    assetAddress: 'SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5',
    assetContractName: 'newyorkcitycoin-token',
    assetName: 'newyorkcitycoin',
    transferUnit: 1,
  },
  MIA: {
    ...FUNGIBLE_CONTRACT,
    assetAddress: 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27',
    assetContractName: 'miamicoin-token',
    assetName: 'miamicoin',
    transferUnit: 1
  },
  SUSDT: {
    ...FUNGIBLE_CONTRACT,
    assetAddress: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
    assetContractName: 'token-susdt',
    assetName: 'sUSDT',
    transferUnit: 100000000
  },
}

// export const CONTRACT_ADDRESS = testnet ? TEST_CONTRACT_ADDRESS : MAIN_CONTRACT_ADDRESS;
export const CONTRACT = testnet ? TEST_CONTRACT : MAIN_CONTRACT;
export const SEND_MANY_FUNCTION_NAME = 'send-many';
export const NETWORK = testnet ? new StacksTestnet() : new StacksMainnet();

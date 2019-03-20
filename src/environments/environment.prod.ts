import { Address } from "@keydonix/liquid-long-client-library";

// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  minQuantity: 0.001, // min value and step size
  liquidLongContractAddress: Address.fromHexString('2FCBaFb681a086103e3d97927d9cA9Af9f1EBD22'),
  defaultEthPriceInUsd: 150,
  jsonRpcAddress: 'https://eth-mainnet.alchemyapi.io/jsonrpc/7sE1TzCIRIQA3NJPD5wg7YRiVjhxuWAE',
  defaultProviderFeeRate: 0.01,
  web3PollingInterval: 1000, // milliseconds: how often we should hammer the provider (e.g., MetaMask) for block updates and such
  ethPricePollingFrequency: 10000, // frequency in milliseconds
  providerFeePollingFrequency: 10000, // frequency in milliseconds
};

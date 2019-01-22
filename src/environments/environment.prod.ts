// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  minQuantity: 0.001, // min value and step size
  liquidLongContractAddress: '0xe61669566c4bf676ae6b55252c457a192bd26a9e',
  defaultEthPriceInUsd: 150,
  jsonRpcAddress: 'https://eth-mainnet.alchemyapi.io/jsonrpc/7sE1TzCIRIQA3NJPD5wg7YRiVjhxuWAE',
  defaultProviderFeeRate: 0.01,
  web3PollingInterval: 1000, // milliseconds: how often we should hammer the provider (e.g., MetaMask) for block updates and such
  ethPricePollingFrequency: 10000, // frequency in milliseconds
  providerFeePollingFrequency: 10000, // frequency in milliseconds
};

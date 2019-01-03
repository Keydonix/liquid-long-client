// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  tooltipTimeout: 5000,
  minQuantity: 0.001,                 // min value and step size
  maxQuantity: 500,
  wrongBrowserReloadInterval: 5000,
  liquidLongContractAddress: '0x80F8DAA435A9AB4B1802BA56FE7E0ABD0F8AB3D3',
  defaultEthPriceInUsd: 195,
  timeoutToSwitchToJsonRpc: 10000,    // milliseconds
  jsonRpcAddress: 'http://127.0.0.1:8545',
  defaultProviderFeeRate: 0.21,
  web3PollingInterval: 10000,         // milliseconds: how often we should hammer the provider (e.g., MetaMask) for block updates and such
  ethPricePollingFrequency: 10000,    // frequency in milliseconds
  providerFeePollingFrequency: 10000, // frequency in milliseconds
};

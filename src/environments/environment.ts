// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  minQuantity: 0.001, // min value and step size
  // liquidLongContractAddress: '0x3Bd3d07a2d352E7CA098CCcb2b0882c9f45597D2',
  liquidLongContractAddress: '0xB03CF72BC5A9A344AAC43534D664917927367487',
  defaultEthPriceInUsd: 150,
  // jsonRpcAddress: 'https://eth-mainnet.alchemyapi.io/jsonrpc/7sE1TzCIRIQA3NJPD5wg7YRiVjhxuWAE',
  jsonRpcAddress: 'http://127.0.0.1:1235',
  defaultProviderFeeRate: 0.01,
  web3PollingInterval: 1000, // milliseconds: how often we should hammer the provider (e.g., MetaMask) for block updates and such
  ethPricePollingFrequency: 10000, // frequency in milliseconds
  providerFeePollingFrequency: 10000, // frequency in milliseconds
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

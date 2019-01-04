// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  minQuantity: 0.001,                 // min value and step size
  maxQuantity: 500,
  liquidLongContractAddress: '0xF3BCABD8FAE29F75BE271EBE2499EDB4C7C139B7',
  defaultEthPriceInUsd: 150,
  jsonRpcAddress: 'http://127.0.0.1:1235',
  defaultProviderFeeRate: 0.01,
  web3PollingInterval: 1000,          // milliseconds: how often we should hammer the provider (e.g., MetaMask) for block updates and such
  ethPricePollingFrequency: 3000,     // frequency in milliseconds
  providerFeePollingFrequency: 3000,  // frequency in milliseconds
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

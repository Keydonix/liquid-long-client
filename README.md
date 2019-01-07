# Liquid Long by Keydonix

## Build the project

`yarn start` - build, run live development server and watch for changes
`yarn build` - make build to `./dist` folder which could be served by any web-server like `npx http-server ./dist`

## IPFS Deploy
start IPFS daemon inside a docker container (note: this step will leave IPFS running, you won't need to repeat in the future)
```
docker container run -d --restart=on-failure --name ipfs --mount 'type=volume,source=ipfs-export,dst=/export' --mount 'type=volume,source=ipfs,dst=/data/ipfs' -p 4001:4001 -p 8080:8080 ipfs/go-ipfs
```
build the project inside a docker container (controlled environment)
```
docker image build --tag liquid-long-client-ipfs-deployer .
```
copy the files to IPFS volume
```
docker container run --rm -it --mount 'type=volume,source=ipfs-export,dst=/export' liquid-long-client-ipfs-deployer
```
hash and pin the files in running IPFS instance
```
docker container exec -it ipfs ipfs add --recursive --pin=true /export/liquid-long-client
```

## Supported browsers

The application was manually tested in the following browsers in full-screen and mobile view:
- Desktop
  - [x] Google Chrome Version 68.0.3440.106 (Official Build) (64-bit) for Mac;
  - [x] Opera Version 55.0.2994.44 for Mac OS X 10.13.6 64-bit;
  - [x] Brave Version 0.23.105;
  - [x] Firefox Quantum Version 61.0.2 (64-бит);
- Mobile
  - [x] Chrome 67.0.3396.87 on Android 5.0.2 doesn't support Web3;
  - [ ] Opera;
  - [ ] Brave;
  - [ ] Firefox;

## Documentation

Bellow is the unit-test structure.
This gives an idea of the implemented functionality
and can serve as documentation which is always up to date.

25 specs, 0 failures, 5 pending specs

###### AppComponent
- should create the app
- should render title in a h1 tag
###### ConfirmPanelComponent
- should create
- tooltip part
  - should pop up/disappear when question mark is clicked
###### InfoPanelComponent
- should create
- tooltip part
  - should pop up/disappear when question mark is clicked
###### InputFeeComponent
- should create
- gradient part
  - should generate event when clicked
  - should generate event when I move the slider
- input part
  - should generate event when changed
  - should generate event on keypress
- tooltip part
  - should pop up/disappear when question mark is clicked
###### InputLeverageComponent
- should create
- should start from placeholder
- gradient part
  - should generate event when clicked
  - should generate event when I move the slider
- button part
  - should generate events when clicked
  - WIP: should generate events when clicked (marbles)
- input part
  - should generate event when changed
  - should generate event on keypress
- tooltip part
  - should pop up/disappear when question mark is clicked
###### InputQuantityComponent
- should create
- should generate event when changed
- should generate event on keypress
- tooltip part
  - should pop up/disappear when question mark is clicked

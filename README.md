# Zoltu  
  
## Build the project  
  
`yarn start` - build, run live development server and watch for changes  
`yarn build` - make build to `./dist/zoltu` folder which could be served by any web-server like `npx http-server ./dist/zoltu`  
  
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
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

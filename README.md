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

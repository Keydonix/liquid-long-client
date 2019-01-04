FROM node:8.15.0 as builder
WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn install
COPY . /app
RUN npx ng build --prod

ENTRYPOINT rm -rf /export/liquid-long-client; cp -r -p /app/dist /export/liquid-long-client

FROM node:20.16.0-alpine

WORKDIR /app

RUN apk add yarn
RUN apk add curl

RUN mkdir /app/node_modules

RUN chown -R node:node /app/node_modules

USER node

EXPOSE 8080

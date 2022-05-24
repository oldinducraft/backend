FROM node:12.19.0 AS build

RUN apt update; apt install python3 make

WORKDIR /usr/src/build

COPY package*.json ./

RUN npm install glob rimraf

COPY . .

RUN npm install

#RUN npm run build

#ARG enviroment_name
#ENV enviroment_name=$enviroment_name
#ENTRYPOINT npm run start:$enviroment_name

FROM node:12.19.0 as production
#-alpine3.9
#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=build /usr/src/build /usr/src/app

ARG enviroment_name
ENV enviroment_name=$enviroment_name
ENTRYPOINT npm $enviroment_name


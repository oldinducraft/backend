FROM node:12.19.0 AS build

RUN apt update; apt install python3 make

WORKDIR /usr/src/app/build

COPY package*.json ./

RUN npm install glob rimraf

#RUN npm install --only=development

COPY . .

RUN npm install

#RUN npm run build

#ARG enviroment_name
#ENV enviroment_name=$enviroment_name
#ENTRYPOINT npm run start:$enviroment_name

FROM node:12.19.0-alpine3.9 as production

#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

#RUN npm install --only=production

COPY . .

COPY --from=build /usr/src/app/build ./build

#CMD ["node", "build/main"]
ARG enviroment_name
ENV enviroment_name=$enviroment_name
ENTRYPOINT npm run $enviroment_name
#start:$enviroment_name

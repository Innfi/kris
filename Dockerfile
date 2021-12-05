FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install 
RUN npm build
COPY . .

EXPOSE 3000
CMD [ "node", "./dist/src/index.js" ]
FROM node:14
WORKDIR /usr/src/app
COPY . .
RUN npm install && npm build

EXPOSE 3000
CMD [ "node", "./dist/src/index.js" ]

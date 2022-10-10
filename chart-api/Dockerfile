FROM node:16 as builder
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]
RUN [ "npm", "install" ]
COPY [ "src/", "./src/" ]
RUN [ "npm", "run", "build" ]
RUN ["/bin/bash", "-c", "find . ! -name dist ! -name node_modules -maxdepth 1 -mindepth 1 -exec rm -rf {} \\;"]

FROM node:16-alpine
LABEL name=trady-chart
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
ENTRYPOINT [ "node", "./dist/src/index.js" ]
EXPOSE 1330
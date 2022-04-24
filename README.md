# Trady

A trade advisor to help stock trading decisions

# Build status

[![action.frontend](https://github.com/Innfi/trady/actions/workflows/action.frontend.yaml/badge.svg)](https://github.com/Innfi/trady/actions/workflows/action.frontend.yaml)
[![action.backend](https://github.com/Innfi/trady/actions/workflows/action.backend.yaml/badge.svg)](https://github.com/Innfi/trady/actions/workflows/action.backend.yaml)

# Features

- View stock charts by daily, weekly and monthly time frame

# Todos

- Save user portfolio 
- Refresh stock data periodically
- Recommend new stocks based on user preference and market status

# Tech/frameworks

## Frontend

- [React](https://reactjs.org/) with [redux-thunk](https://github.com/reduxjs/redux-thunk)
- [Typescript](https://www.typescriptlang.org/)
- [Material-UI](https://mui.com/)

## Backend

- [Node.js](https://nodejs.org/ko/)
- [Express.js](https://expressjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [TypeDI](https://github.com/typestack/typedi)
- [Routing-controllers](https://github.com/typestack/routing-controllers)

## Intrastructure
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/ko/) on [EKS](https://aws.amazon.com/ko/eks/)
- [Helm Chart](https://helm.sh/)
- [Redis](https://redis.io/)

## CI/CD

- [Github Actions](https://github.com/features/actions)
- [ArgoCD](https://argo-cd.readthedocs.io/)
